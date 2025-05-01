<script setup lang="ts">
import { ref } from "vue";
import { BookData } from "@/types/Book.types";
import BookCard from "./components/BookCard.vue";

// Sample data imitating server response.
const booksData = ref<BookData[]>([
  {
    "_id": "6759f71478067a897c733cba",
    "coverUrl": "https://covers.openlibrary.org/b/id/8243314-L.jpg",
    "title": "The Iron Heel",
    "author": ["Jack London"],
    "subject": [
      "Revolutions, fiction",
      "Oligarchy, fiction",
      "Utopias, fiction",
      "Revolutionaries, fiction",
      "Dysyopias, fiction",
      "Science Fiction",
      "Socialism, fiction"
    ],
    "rating": 2.996213,
    "publishedYear": 1924,
    "language": ["yid", "fin", "ger", "spa", "swe", "eng", "chi", "fre", "por"],
    "ebookAccess": true,
    "complete": true,
    "link": {
      "size": {
        "value": 0.5,
        "metric": "MB"
      },
      "readUrl": "https://openlibrary.org/isbn/9781438547824",
      "downloadUrl": "https://www.gutenberg.org/ebooks/24848.epub.images",
      "format": "epub",
      "buyUrl": "https://www.amazon.com/dp/9781438547824",
      "_id": "67601fbc314139afa2c0b882"
    }
  },
  {
    "_id": "6759f71478067a897c733cbd",
    "coverUrl": "https://covers.openlibrary.org/b/id/14364546-L.jpg",
    "title": "Lilith",
    "author": ["George MacDonald"],
    "subject": [
      "Fiction, romance, fantasy",
      "Fiction, general",
      "Christian fiction"
    ],
    "rating": 2.3975053,
    "publishedYear": 1924,
    "language": ["ita", "eng", "ger"],
    "ebookAccess": true,
    "complete": true,
    "link": {
      "size": {
        "value": 0.5,
        "metric": "MB"
      },
      "readUrl": "https://openlibrary.org/isbn/1098765265",
      "downloadUrl": "https://www.gutenberg.org/ebooks/1640.epub.images",
      "format": "epub",
      "buyUrl": "https://www.amazon.com/dp/1098765265",
      "_id": "678fb96c4f6d2f65b8ea6a1a"
    }
  },
  {
    "_id": "6759f71478067a897c733cc0",
    "coverUrl": "https://covers.openlibrary.org/b/id/802982-L.jpg",
    "title": "Anthem",
    "author": ["Ayn Rand", "Erin Bateman"],
    "subject": [
      "Fiction",
      "Individuality",
      "Time travel in fiction",
      "Individuality in fiction"
    ],
    "rating": 3.0934825,
    "publishedYear": 1936,
    "language": ["eng"],
    "ebookAccess": true,
    "complete": false
  }
]);

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
</script>

<template>
  <div class="books-view">
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
        />
      </div>
    </div>
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