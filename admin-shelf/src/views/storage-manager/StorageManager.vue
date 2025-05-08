<script setup lang="ts">
import { ref } from 'vue';
import ActionNav from '@/components/ui/ActionNav.vue';
import ActionTab from '@/components/ui/ActionTab.vue';
import ConfirmationCard from '@/components/ui/ConfirmationCard.vue';
import BooksView from './books-view/BooksView.vue';
import BookForm from './book-form/BookForm.vue';
import { BookFormDTO } from './book-form/bookForm.types';
import { populateFormById } from './storageManager';
import { deleteBook, postBookEdit, postNewBook } from './book-form/bookForm';

const activeTab = ref('books');

/** Tabs displayed on ActionNav. Not all tabs are visible */
const visibleTabs = [
  { id: "books",  name: "Books"      },
  { id: "create", name: "Create"     },
  { id: "stats",  name: "Statistics" },
]

// Handle tab changes from ActionNav
const handleTabChange = (tab: string) => {
  activeTab.value = tab;
};

// Edit actions
const editedBookId = ref<string | null>(null);
const initialEditFormDTO = ref<BookFormDTO | null>(null);

const goToEditTab = async (bookId: string) => {
  editedBookId.value = bookId;
  initialEditFormDTO.value = await populateFormById(editedBookId.value);
  handleTabChange('edit');
}

const submitEditedBook = async (book: BookFormDTO) => {
  if (editedBookId.value) {
    const responseStatus = await postBookEdit(editedBookId.value, book);
    if (responseStatus) {
      alert("Edited book with id: " + editedBookId.value);
    } else {
      alert("Could not edit book with id: " + editedBookId.value);
    }
  }
}

// Create new actions
const submitNewBook = async (book: BookFormDTO) => {
  const responseStatus = await postNewBook(book);
  if (responseStatus) {
    alert("Successfully created new book");
  }
  else {
    alert("Could not create new book");
  }
}

// Delete actions
const deletedBookId = ref<string | null>(null);

const removeBook = async (bookId: string) => {
  deletedBookId.value = bookId;
  if (deletedBookId.value) {
    handleTabChange('remove');
  }
}

const handleBookDelete = async () => {
  if (deletedBookId.value) {
    const responseStatus = await deleteBook(deletedBookId.value)
    if (responseStatus) {
      alert(`Successfully deleted book with id: ${deletedBookId.value}`);
    }
    else {
      alert(`Could delete book with id: ${deletedBookId.value}`);
    }
  }
}

const handleBookDeleteCancel = () => {
  alert(`'Delete' operation canceled for book with id: ${deletedBookId.value}`);
  deletedBookId.value = null;
}
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
.store-manager {
  margin: 0 0 auto 2rem;
  padding: 1rem;
}
</style>