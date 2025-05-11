<script setup lang="ts">
import { ref, onMounted, watch, reactive } from 'vue';
import { Book } from '@/types/Book';
import BookGrid from '@/components/book/BookGrid.vue';
import BookSidebar from '@/components/book/BookSidebar.vue';
import { useFavoritesStore } from '@/store/favoritesStore';
import { getLocalFavorites } from '@/services/favoritesService';
import { getBooksByIds } from '@/api/book';

const favoritesStore = useFavoritesStore();

const books = ref<Book[]>([]);

// Handles interaction with user. If message should not be displayed it is made empty.
const messages = reactive({
  general: '',
  instruction: '',
  error: ''
});

async function populateFavoriteBooks() {
  messages.error = '';
  const localFavorites = getLocalFavorites();

  if (localFavorites.length === 0) {
    messages.general = "You do not have favorite books yet.";
    messages.instruction = "CLick 'heart' or 'plus' icon to add a favorite book.";
    return;
  }

  // Books are fetched from '/books' api instead of '/favorites/' 
  // because we want to include favorites from local storage for unauthorized users.
  const response = await getBooksByIds(localFavorites);

  if (response.success) {
    messages.general = '';
    messages.instruction = '';
    books.value = response.data;
  } else {
    messages.error = response.message;
  }
}

const selectedBookId = ref<string>('');
const isSidebarOpen = ref<boolean>(false);

async function openSidebar(bookId: string) {
  if (isSidebarOpen.value) {
    closeSidebar();

    // Delay to make sure sidebar closes before opening a new one. 
    await setTimeout(() => {/* */}, 0);
  }

  selectedBookId.value = bookId;
  isSidebarOpen.value = true;
}

function closeSidebar() {
  isSidebarOpen.value = false;
}

// Add watch to ensure ui changes on every book favorite status change.
watch(
  () => favoritesStore.favoriteBooksIds,
  async () => {
    await populateFavoriteBooks();
  },
  { immediate: true }
);

onMounted(async () => {
  await populateFavoriteBooks();  
});

</script>

<template>
 <div class="favorites-view">
  <h2 class="view-title">Your Favorite Books</h2>
  <div v-if="messages.general" class="general-message">{{ messages.general }}</div>
  <div v-if="messages.instruction" class="instruction-message">{{ messages.instruction }}</div>
  <div v-if="messages.error" class="error-message">{{ messages.error }}</div>
  <BookGrid 
    v-if="books.length > 0"
    class="book-content" 
    :books="books"
    @select-book="openSidebar" 
  />
  <BookSidebar 
    v-if="isSidebarOpen"
    :bookId="selectedBookId"
    @close="closeSidebar"
  />
 </div>
</template>

<style scoped lang="scss">
.favorites-view {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.book-content, .book-skeleton {
  width: 70%;
  margin: 20px auto;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
}

.general-message, .instruction-message, .error-message {
  padding: 8px;
}

.general-message {
  font-size: medium;
}

.instruction-message {
  font-size: small;
}

.error-message {
  color: red;
}
</style>
