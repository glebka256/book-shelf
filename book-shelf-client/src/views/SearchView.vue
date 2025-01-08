<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import SearchBar from '@/components/SearchBar.vue';
import BookSkeleton from '@/components/BookSkeleton.vue';
import BookGrid from '@/components/BookGrid.vue';
import BookSidebar from '@/components/BookSidebar.vue';
import baseInstance from '@/api/baseInstance';
import { Book } from '@/types/Book';

const isPageLoading = ref<boolean>(false);
const page = ref<number>(1);

const route = useRoute();
const books = ref<Book[]>([]);

async function fetchSearchResult(query: string): Promise<Book[]> {
  isPageLoading.value = true;

  try {
    const response = await baseInstance.get<Book[]>(
      `/books/search/${query}/${page.value}`
    );

    if (!response.data) {
      throw new Error("Invalid search response.");
    }

    page.value += 1;
    return response.data as Book[];
  } catch (error) {
    console.error(`Could not fetch search results by query: ${query}`);
    return [];
  } finally {
    isPageLoading.value = false;
  }
}

async function updateSearch() {
  page.value = 1;
  const searchQuery = route.query.q as string || '';

  if (!searchQuery.trim()) {
    books.value = [];
    return;
  }

  books.value = await fetchSearchResult(searchQuery);
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

// Watch the query parameter for changes
watch(() => route.query.q, async () => {
  await updateSearch();
});

onMounted(async () => {
  await updateSearch();
});

</script>

<template>
 <div class="search-view">
  <div class="empty-top"></div>
  <search-bar @submit="updateSearch"/>
  <h2 class="view-title">Search Results</h2>
  <div v-if="isPageLoading" class="book-skeleton">
    <book-skeleton :skeleton-type="'vertical'" />
  </div>
  <book-grid 
    v-else
    class="search-content" 
    :books="books"
    @select-book="openSidebar" 
  />
  <book-sidebar 
    v-if="isSidebarOpen"
    :bookId="selectedBookId"
    @close="closeSidebar"
  />
 </div>
</template>

<style scoped lang="scss">
.search-view {
  display: flex;
  flex-direction: column;
  align-items: center;
}

// Used to to prevent content from going under the search bar before scroll.
// Removing makes search bar twitch on first scroll.
.empty-top {
  height: 64px;
}

// Just used to apply observer to it's reference, should not be visible.
.bottom-observer {
  height: 1px;
}

.search-content, .book-skeleton {
  width: 70%;
  margin: 20px auto;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
}
</style>