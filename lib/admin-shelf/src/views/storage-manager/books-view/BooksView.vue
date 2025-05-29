<script setup lang="ts">
import { ref, onMounted, defineEmits } from "vue";
import { BookData } from "@/types/Book.types";
import { getBookSearch, getSortedBooks } from "./booksView";
import { SortOrder } from "./booksView.types";
import { SortOption } from "@/component-lib/ui/SortDropdown.vue";

import BookCard from "./components/BookCard.vue";
import PaginationBox from "@/component-lib/ui/PaginationBox.vue";
import BooksCount from './components/BooksCount.vue';
import SearchInput from '@/component-lib/ui/SearchInput.vue';
import SortDropdown from '@/component-lib/ui/SortDropdown.vue';

const emit = defineEmits(['edit', 'remove']);

const booksData = ref<BookData[]>([]);
const totalBooks = ref<number>(0);

const page = ref<number>(1);
const totalPages = ref<number>(1);
const limit = 50;

const currentSortBy = ref<string>('title');
const currentOrder = ref<SortOrder>('asc');
const currentSearch = ref<string>('');

const handleEdit = (bookId: string) => emit('edit', bookId);
const handleRemove = (bookId: string) => emit('remove', bookId);

const sortOptions: SortOption[] = [
  { sortBy: 'title',         order: 'asc',  label: 'Title A-Z'      },
  { sortBy: 'title',         order: 'desc', label: 'Title Z-A'      },
  { sortBy: 'author',        order: 'asc',  label: 'Author A-Z'     },
  { sortBy: 'author',        order: 'desc', label: 'Author Z-A'     },
  { sortBy: 'rating',        order: 'asc',  label: 'Lowest-Highest' },
  { sortBy: 'rating',        order: 'desc', label: 'Highest-Lowest' },
  { sortBy: 'publishedYear', order: 'desc', label: 'Newest First'   },
  { sortBy: 'publishedYear', order: 'asc',  label: 'Oldest First'   },
];

const isSearchRelevant = (query: string): boolean => {
  const RELEVANT_SEARCH_SIZE = 4;

  return query !== undefined && query.length >= RELEVANT_SEARCH_SIZE;
}

const loadSearchedBooks = async (): Promise<void> => {
  const response = await getBookSearch(page.value, currentSearch.value);

  // Search response only contains books, keep other values unchanged
  booksData.value = response.books;
}

const loadSortedBooks = async (): Promise<void> => {
  const response = await getSortedBooks(
    page.value, 
    limit, 
    currentSortBy.value, 
    currentOrder.value
  );

  booksData.value = response.books;
  totalPages.value = response.totalPages;
  totalBooks.value = response.totalBooks;
}

const updateBooks = async (): Promise<void> => {
  if (isSearchRelevant(currentSearch.value)) {
    await loadSearchedBooks();
  } else {
    await loadSortedBooks();
  }
}

const handleSearch = async (query: string): Promise<void> => {
  if (isSearchRelevant(query)) {
    console.log("I am relevant: ", query)

    currentSearch.value = query;
    page.value = 1;
    updateBooks();
  }
};

const handleSort = async (option: SortOption): Promise<void> => {
  currentSortBy.value = option.sortBy;

  // Should refer to type but SortDropdown doesnt provide any
  const sortOrder = option.order === 'desc' ? 'desc' : 'asc';
  currentOrder.value = sortOrder;
  
  page.value = 1;
  updateBooks();
};

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
    <div class="books-navigation">
      <div class="nav-header">
        <BooksCount :totalBooks="totalBooks"/>

        <div class="nav-controls">
          <div class="search-container">
            <SearchInput 
              @input:submit="handleSearch"
            />
          </div>

          <div class="sort-container">
            <SortDropdown 
              :sortOptions="sortOptions"
              :defaultSort="sortOptions[0]"
              @sort="handleSort"
            />
          </div>
        </div>

      </div>
    </div>

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
@import "@/styles/variables.scss";

.books-view {
  padding: 1rem;
  width: 100%;
  max-width: $manager-content-mxwidth;
  margin: 0 auto;
}

.books-navigation {
  margin-bottom: 2rem;

  .nav-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;

    .nav-controls {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1rem;

      .search-container {
        min-width: 280px;
      }

      .sort-container {
        position: relative;
      }
    }
  }
}

.books-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

@media (max-width: $small-width) {
  .nav-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .nav-controls {
    flex-direction: column;
    gap: 0.75rem;
  }

  .search-container {
    min-width: unset;
  }

  .books-container {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: $smallest-width) {
  .books-container {
    grid-template-columns: 1fr;
  }

  .nav-controls {
    gap: 0.5rem;
  }
}
</style>