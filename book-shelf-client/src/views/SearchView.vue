<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import SearchBar from '@/components/common/SearchBar.vue';
import BookSkeleton from '@/components/book/BookSkeleton.vue';
import BookGrid from '@/components/book/BookGrid.vue';
import BookSidebar from '@/components/book/BookSidebar.vue';
import TextLoader from '@/components/common/TextLoader.vue';
import baseInstance from '@/api/baseInstance';
import { Book } from '@/types/Book';

const isPageLoading = ref<boolean>(false);
const isMoreLoading = ref<boolean>(false);
const isPageComplete = ref<boolean>(false);
const page = ref<number>(1);

const route = useRoute();
const books = ref<Book[]>([]);

interface SearchResponse {
  searchComplete: boolean,
  books: Book[]
}

async function fetchSearchResult(query: string): Promise<Book[]> {
  try {
    const response = await baseInstance.get<SearchResponse>(
      `/books/search/${query}/${page.value}`
    );

    if (!response.data) {
      throw new Error("Invalid search response.");
    }

    page.value += 1;
    isPageComplete.value = response.data.searchComplete;

    return response.data.books as Book[];
  } catch (error) {
    console.error(`Could not fetch search results by query: ${query}`);
    return [];
  }
}

async function updateSearch(query: string) {
  page.value = 1;
  const searchQuery = query;

  if (!searchQuery.trim()) {
    books.value = [];
    return;
  }

  isPageLoading.value = true;

  try {
    books.value = await fetchSearchResult(searchQuery);
  } finally {
    isPageLoading.value = false;
  }
}

async function loadMore() {
  const searchQuery = (route.query.q as string) || '';

  if (!searchQuery.trim()) {
    return;
  }

  isMoreLoading.value = true;

  try {
    const moreBooks = await fetchSearchResult(searchQuery);
    books.value = [...books.value, ...moreBooks];
  } finally {
    isMoreLoading.value = false;
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

// Watch the query parameter for changes
watch(() => route.query.q, async () => {
  await updateSearch((route.query.q) as string);
});

const bottomObserver = ref<IntersectionObserver | null>(null);
const bottomRef = ref<HTMLDivElement>();

onMounted(async () => {
  await updateSearch((route.query.q) as string);

  bottomObserver.value = new IntersectionObserver((entries) => {
    if (
      entries[0].isIntersecting 
      && !isMoreLoading.value 
      && !isPageLoading.value
      && !isPageComplete.value
    ) {
      loadMore();
    }
  });

  if (bottomRef.value) {
    bottomObserver.value.observe(bottomRef.value);
  }
});

onBeforeUnmount(() => {
  if (bottomObserver.value && bottomRef.value) {
    bottomObserver.value.unobserve(bottomRef.value);
  }
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
  <div v-if="isMoreLoading" class="load-more">
    <TextLoader loader-text="Loading more books..."/>
  </div>
  <div ref="bottomRef" class="bottom-observer"></div>
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