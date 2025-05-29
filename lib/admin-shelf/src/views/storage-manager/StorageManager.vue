<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BookFormDTO } from './book-form/bookForm.types';
import { populateFormById } from './storageManager';
import { deleteBook, postBookEdit, postNewBook } from './book-form/bookForm';

import ActionNav from '@/components/ui/ActionNav.vue';
import ActionTab from '@/components/ui/ActionTab.vue';
import ConfirmationCard from '@/components/ui/ConfirmationCard.vue';
import BooksView from './books-view/BooksView.vue';
import BookForm from './book-form/BookForm.vue';

const route = useRoute();
const router = useRouter();

/** Map of route paths to tab IDs */
const routeToTabMap: { [key: string]: string } = {
  'books': 'books',
  'create': 'create',
  'stats': 'stats',
  'edit': 'edit',
  'remove': 'remove'
};

/** Map of tab IDs to route names */
const tabToRouteMap: { [key: string]: string } = {
  'books': 'storage-manager-books',
  'create': 'storage-manager-create',
  'stats': 'storage-manager-stats',
  'edit': 'storage-manager-edit',
  'remove': 'storage-manager-remove'
};

// activeTab is recieved from route
const activeTab = computed(() => {
  const currentPath = route.path.split('/').pop();
  
  if (currentPath && routeToTabMap[currentPath]) {
    return routeToTabMap[currentPath];
  }

  // Handle edit/remove routes that have bookId parameter
  if (route.name === 'storage-manager-edit') return 'edit';
  
  if (route.name === 'storage-manager-remove') return 'remove';
  
  return 'books';
});

/** Tabs displayed on ActionNav. Not all tabs are visible */
const visibleTabs = [
  { id: "books",  name: "Books"      },
  { id: "create", name: "Create"     },
  { id: "stats",  name: "Statistics" },
]

/** Handles tab changes from ActionNav */
const handleTabChange = (tab: string): void => {
  const routeName = tabToRouteMap[tab];
  if (routeName && route.name !== routeName) {
    router.push({ name: routeName });
  }
};

// Edit actions
const editedBookId = computed(() => route.params.bookId as string || null);

const initialEditFormDTO = ref<BookFormDTO | null>(null);

const goToEditTab = (bookId: string): void => {
  router.push({ 
    name: 'storage-manager-edit', 
    params: { bookId } 
  });
}

const goToDefaultTab = (): void => {
  // books tab is default to navigate after successful edit
  router.push({ name: 'storage-manager-books' });
}

const submitEditedBook = async (book: BookFormDTO): Promise<void> => {
  if (editedBookId.value) {
    const responseStatus = await postBookEdit(editedBookId.value, book);
    if (responseStatus) {
      alert("Edited book with id: " + editedBookId.value);
      goToDefaultTab();
    } else {
      alert("Could not edit book with id: " + editedBookId.value);
    }
  }
}

// Create new actions
const submitNewBook = async (book: BookFormDTO): Promise<void> => {
  const responseStatus = await postNewBook(book);
  if (responseStatus) {
    alert("Successfully created new book");
    goToDefaultTab();
  }
  else {
    alert("Could not create new book");
  }
}

// Delete actions
const deletedBookId = computed(() => route.params.bookId as string || null);

const removeBook = async (bookId: string) => {
  router.push({ 
    name: 'storage-manager-remove', 
    params: { bookId } 
  });
}

const handleBookDelete = async (): Promise<void> => {
  if (deletedBookId.value) {
    const responseStatus = await deleteBook(deletedBookId.value)
    if (responseStatus) {
      alert(`Successfully deleted book with id: ${deletedBookId.value}`);
    }
    else {
      alert(`Could delete book with id: ${deletedBookId.value}`);
    }
    goToDefaultTab();
  }
}

const handleBookDeleteCancel = (): void => {
  alert(`'Delete' operation canceled for book with id: ${deletedBookId.value}`);
  goToDefaultTab();
}

// Load edit form data when we are on the edit route
const loadEditData = async () => {
  if (activeTab.value === 'edit' && editedBookId.value) {
    initialEditFormDTO.value = await populateFormById(editedBookId.value);
  }
};

watch(() => [activeTab.value, editedBookId.value], async () => {
  if (activeTab.value === 'edit') {
    await loadEditData();
  }
}, { immediate: true });

onMounted(async () => {
  if (activeTab.value === 'edit') {
    await loadEditData();
  }
});
</script>

<template>
  <div class="store-manager"> 
    <!-- Navigation component -->
    <ActionNav 
      :tabs="visibleTabs"
      :activeTab="activeTab"
      title="Storage Manager"
      @select-tab="handleTabChange"
    />
    
    <!-- Tab content containers -->
    <ActionTab tabId="books" :activeTab="activeTab">
      <BooksView 
        @edit="goToEditTab"
        @remove="removeBook"  
      />
    </ActionTab>
    
    <ActionTab tabId="create" :activeTab="activeTab">
      <BookForm @submit="submitNewBook" />
    </ActionTab>
    
    <ActionTab tabId="stats" :activeTab="activeTab">
      <h2>Store Statistics</h2>
      <p>Sales and inventory statistics will appear here.</p>
    </ActionTab>

    <ActionTab tabId="edit" :activeTab="activeTab">
      <BookForm 
        v-if="initialEditFormDTO" 
        :initialBookState="initialEditFormDTO" 
        @submit="submitEditedBook"
      />
    </ActionTab>

    <ActionTab tabId="remove" :activeTab="activeTab">
      <ConfirmationCard
        :promptMessage="`Are you sure you want to delete book with this id?`"
        inputLabel="Enter book id to confirm"
        :confirmationText="deletedBookId ?? 'secret lol'"
        confirmButtonText="Delete Book"
        @confirm="handleBookDelete"
        @cancel="handleBookDeleteCancel"
      />
    </ActionTab>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/manager.scss';

.store-manager {
  @extend %manager-base;
}
</style>