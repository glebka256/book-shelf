<script setup lang="ts">
import { ref, onMounted, defineEmits } from "vue";
import { BookData } from "@/types/Book.types";
import BookCard from "./components/BookCard.vue";
import { getBooks } from "./booksView";
import PaginationBox from "@/component-lib/ui/PaginationBox.vue";

const emit = defineEmits(['edit', 'remove']);

const booksData = ref<BookData[]>([]);
const totalBooks = ref<number>(0);
const page = ref<number>(1);
const totalPages = ref<number>(1);
const limit = 50;

const handleEdit = (bookId: string) => emit('edit', bookId);
const handleRemove = (bookId: string) => emit('remove', bookId);

const updateBooks = async (): Promise<void> => {
  const response = await getBooks(page.value, limit);
  booksData.value = response.books;
  totalPages.value = response.totalPages;
  totalBooks.value = response.totalBooks;
}

const handleLeftPageClick = async (): Promise<void> => {
  page.value--;
  updateBooks();
}

const handleRightPageClick = async (): Promise<void> => {
  page.value++;
  updateBooks();
}

const handlePageClick = async (newPage: number): Promise<void> => {
  page.value = newPage
  updateBooks();
}

const selectedBookId = ref<string | null>(null);

const toggleBookDetails = (bookId: string) => {
  if (selectedBookId.value === bookId) {
    selectedBookId.value = null;
  } else {
    selectedBookId.value = bookId;
  }
};

const isSelected = (bookId: string): boolean => {
  return selectedBookId.value === bookId;
};

onMounted(async () => {
  updateBooks();
});
</script>

<template>
  <div class="books-view">
    <h3>Books total: {{ totalBooks }}</h3>
    <div class="books-container">
      <div 
        v-for="book in booksData" 
        :key="book._id" 
        class="book-card-wrapper" 
        :class="{ 'selected': isSelected(book._id) }"
        @click="toggleBookDetails(book._id)"
      >
        <BookCard
          :book="book"
          :isSelected="isSelected(book._id)"
          @edit="handleEdit"
          @remove="handleRemove"
        />
      </div>
    </div>
    <PaginationBox 
      :currentPage="page"
      :totalPages="totalPages"
      @leftPageClick="handleLeftPageClick"
      @rightPageClick="handleRightPageClick"
      @pageClick="handlePageClick"
    />
  </div>
</template>

<style scoped lang="scss">
.books-view {
  padding: 1rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.books-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .books-container {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .books-container {
    grid-template-columns: 1fr;
  }
}
</style>