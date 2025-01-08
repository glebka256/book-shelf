<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import SearchBar from '@/components/SearchBar.vue';
import BookSidebar from '@/components/BookSidebar.vue';
import BookSkeleton from '@/components/BookSkeleton.vue';
import CommonButton from '@/components/CommonButton.vue';
import HorizontalScroll from '@/components/HorizontalScroll.vue';
import IconButton from '@/components/IconButton.vue';
import FilterForm from '@/components/FilterForm.vue';
import BookGrid from '@/components/BookGrid.vue';
import { Book } from '@/types/Book';
import baseInstance from '@/api/baseInstance';
import { FilterFormInstance, FilterQuery } from '@/types/Filter';
import TextLoader from '@/components/TextLoader.vue';

const popularBooks = ref<Book[]>([]);
const recommendedBooks = ref<Book[]>([]);
const filteredBooks = ref<Book[]>([]);

const isPageLoading = ref(false);
const isRecommendedLoading = ref(false);
const isDiscoverLoading = ref(false);
const moreLoading = ref(false);

const errorMessage = ref<string | null>(null);

async function fetchPopularBooks(page: number, limit: number): Promise<Book[]> {
  errorMessage.value = null;

  try {
    const response = await baseInstance.get<Book[]>(
      `/books/popular/${page}/${limit}`
    );
    
    if (!response.data) {
      throw new Error('Invalid recommended response data.');
    }

    return response.data as Book[];
  } catch (error) {
    errorMessage.value = `Could not fetch popular books. Error: ${error}`;
    return [];
  }
}

async function handleRecommendationReset() {
  // Set with popular for now.
  // TODO: update to recommended request when it's implemented on server.
  isRecommendedLoading.value = true;
  popularBooks.value = await fetchPopularBooks(1, 50);
  isRecommendedLoading.value = false;
  
  if (popularBooks.value.length > 0) {
    recommendedBooks.value = popularBooks.value;
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

const filterFormRef = ref<FilterFormInstance>();
const filterPage = ref(1);

function handleFilterReset() {
  if (filterFormRef.value) {
    filterFormRef.value.resetOptions();
    filterPage.value = 1;
  }
}

function handleFilterSubmit() {
  if (filterFormRef.value) {
    const selectedFilters: FilterQuery = filterFormRef.value.selectedOptions;
    applyFilters(selectedFilters);
  }
}

async function fetchFiltred(page: number, query: FilterQuery): Promise<Book[]> {
  try {
    const body = {
      'query': query,
      'page': page
    }

    const response = await baseInstance.post(
      `/books/filter/`,
      body
    );

    const books = await response.data.books as Book[];
    return books;
  } catch (error) {
    console.error(`Could not fetch filtered books. Page ${page}, Error: ${error}`);
    return [];
  }
}

async function applyFilters(query: FilterQuery): Promise<void> {
  isDiscoverLoading.value = true;
  filterPage.value = 1;
  
  try {
    const books = await fetchFiltred(1, query);
    filteredBooks.value = books;

    filterPage.value += 1;
  } catch (error) {
    console.error(`Could not get books by filters applied. Error: ${error}`);
    isDiscoverLoading.value = false;
  } finally {
    isDiscoverLoading.value = false;
  }
}

async function loadFiltered(query: FilterQuery): Promise<void> {
  moreLoading.value = true;
  try {
    filterPage.value += 1;

    const books = await fetchFiltred(filterPage.value, query); 
    filteredBooks.value = [...filteredBooks.value, ...books];
  } catch (error) {
    console.error(`Could not load more filtered books. Error: ${error}`);
  } finally {
    moreLoading.value = false;
  }
}

const loadMoreBooks = () => {
  if (filterFormRef.value) {
    const selectedFilters: FilterQuery = filterFormRef.value.selectedOptions;
    loadFiltered(selectedFilters);
  }
}

const bottomObserver = ref<IntersectionObserver | null>(null);
const bottomRef = ref<HTMLDivElement>();

onMounted(async () => {
  isPageLoading.value = true;

  const [popular, filtered] = await Promise.all([
    handleRecommendationReset(),
    handleFilterSubmit(),
  ]);

  isPageLoading.value = false;

  // For now populate recommended with just popular.
  recommendedBooks.value = popularBooks.value || [];
  filteredBooks.value = filteredBooks.value || [];

  bottomObserver.value = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !moreLoading.value) {
      loadMoreBooks();
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
 <div class="home-view">
  <div class="empty-top"></div>
  <search-bar placeholder="Search book" />
  <div class="recommended-view">
    <div class="view-heading">
      <div class=heading-row>
        <div class="recommended-title-wrapper">
          <h2 class="view-title">Recommended</h2>
          <icon-button icon-type="reset" 
          @click="handleRecommendationReset" />
        </div>
        <div class="view-options">
          <common-button>See All</common-button>
        </div>
      </div>
    </div>
    <div class="book-skeleton" v-if="isPageLoading || isRecommendedLoading">
      <book-skeleton :skeleton-type="'horizontal'" />
    </div>
    <horizontal-scroll v-else :books="recommendedBooks" @select-book="openSidebar"/>
  </div>
  <div class="book-skeleton" v-if="isPageLoading && isDiscoverLoading">
    <book-skeleton :skeleton-type="'vertical'" />
  </div>
  <div v-else class="search-view">
    <div class="view-heading">
      <div class="heading-row">
        <h2 class="view-title">Discover new</h2>
        <div class="view-options filter-buttons">
          <common-button @click="handleFilterReset">Reset Filter</common-button>
          <common-button @click="handleFilterSubmit">Apply Filter</common-button>
        </div>
      </div>
      <filter-form ref="filterFormRef"/>
    </div>
    <div class="book-skeleton" v-if="isDiscoverLoading || isPageLoading">
      <book-skeleton :skeleton-type="'vertical'" />
    </div>
    <book-grid v-else :books="filteredBooks" @select-book="openSidebar"/>
    <div v-if="moreLoading" class="load-more">
      <TextLoader loader-text="Loading more books..."/>
    </div>
    <div ref="bottomRef" class="bottom-observer"></div>
  </div>
  <book-sidebar 
    v-if="isSidebarOpen"
    :bookId="selectedBookId"
    @close="closeSidebar"
  />
 </div>
</template>

<style scoped lang="scss">
.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
}

// Used to to prevent content from going under the search bar before scroll.
// Removing makes search bar twitch on first scroll.
.empty-top {
  height: 100px;
}

// Just used to apply observer to it's reference, should not be visible.
.bottom-observer {
  height: 1px;
}

.book-skeleton {
  margin: 20px auto;
  width: 90%;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
}

.view-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.recommended-title-wrapper {
  display: flex;
  flex-direction: row;
  gap: 12px;
}

.recommended-view, .search-view {
  margin-top: -35px;
  background-color: white;
  width: 90%;
  border-radius: 13px;
}

.search-view {
  margin-top: 20px;
}

.view-heading {
  background-color: #edf1ff;
  padding-left: 20px;
  padding-right: 20px;
  margin: 20px 25px;
  border-radius: 10px;
}

.heading-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-options {
  &.filter-buttons {
    display: flex;
    flex-direction: row;
    gap: 20px;
  }
}

.load-more {
  text-align: center;
  padding: 20px;
}
</style>
