<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue';
import SearchBar from '@/components/common/SearchBar.vue';
import BookSidebar from '@/components/book/BookSidebar.vue';
import BookSkeleton from '@/components/book/BookSkeleton.vue';
import CommonButton from '@/components/common/buttons/CommonButton.vue';
import HorizontalScroll from '@/components/layout/HorizontalScroll.vue';
import IconButton from '@/components/common/buttons/IconButton.vue';
import FilterForm from '@/components/layout/FilterForm.vue';
import BookGrid from '@/components/book/BookGrid.vue';
import TextLoader from '@/components/common/loaders/TextLoader.vue';
import { Book } from '@/types/Book';
import { FilterFormInstance, FilterQuery } from '@/types/Filter';
import { InteractionTypes } from '@/types/User';
import { useInteractionStore } from '@/store/interactionStore';
import { getFilteredBooks, getPopularBooks } from '@/api/book';

const popularBooks = ref<Book[]>([]);
const recommendedBooks = ref<Book[]>([]);
const filteredBooks = ref<Book[]>([]);

const loading = reactive({
  page: false,
  recommended: false,
  discover: false,
  more: false,
  errorMessage: ''
});

async function handleRecommendationReset() {
  // Set with popular for now.
  // TODO: update to recommended request when it's implemented on server.
  loading.recommended = true;

  loading.errorMessage = '';
  try {
    popularBooks.value = await getPopularBooks(1, 50);
  } catch (error) {
    loading.errorMessage = "Could not fetch popular books. Error: ", error;
  } finally {
    loading.recommended = false;
  }
  
  if (popularBooks.value.length > 0) {
    recommendedBooks.value = popularBooks.value;
  }
}

const sidebar = reactive({
  open: false,
  bookId: '',
});

async function handleBookSelect(bookId: string) {
  openSidebar(bookId);

  const interactionStore = useInteractionStore();
  interactionStore.saveInteraction(InteractionTypes.Cover, bookId);
}

async function openSidebar(bookId: string) {
  if (sidebar.open) {
    closeSidebar();

    // Delay to make sure sidebar closes before opening a new one. 
    await setTimeout(() => {/* */}, 0);
  }

  sidebar.bookId = bookId;
  sidebar.open = true;
}

function closeSidebar() {
  sidebar.open = false;
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

// Used to overwrite previous filter results and populate them from page 1.
async function applyFilters(query: FilterQuery): Promise<void> {
  loading.discover = true;
  filterPage.value = 1;
  
  try {
    filteredBooks.value = await getFilteredBooks(1, query);

    filterPage.value += 1;
  } catch (error) {
    console.error(`Could not get books by filters applied. Page: ${filterPage.value} Error: ${error}`);
  } finally {
    loading.discover = false;
  }
}

// Used to add more pages of results for the same filter query.
const loadFiltered = async () => {
  if (filterFormRef.value) {
    const query: FilterQuery = filterFormRef.value.selectedOptions;
    
    loading.more = true;
    try {
      const books = await getFilteredBooks(filterPage.value, query); 
      filteredBooks.value = [...filteredBooks.value, ...books];

      filterPage.value += 1;
    } catch (error) {
      console.error(`Could not load more filtered books. Page: ${filterPage.value} Error: ${error}`);
    } finally {
      loading.more = false;
    }
  }
}

const bottomObserver = ref<IntersectionObserver | null>(null);
const bottomRef = ref<HTMLDivElement>();

onMounted(async () => {
  loading.page = true;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [popular, filtered] = await Promise.all([
    handleRecommendationReset(),
    handleFilterSubmit(),
  ]);

  loading.page = false;

  // For now populate recommended with just popular.
  recommendedBooks.value = popularBooks.value || [];
  filteredBooks.value = filteredBooks.value || [];

  bottomObserver.value = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loading.more) {
      loadFiltered();
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
  <search-bar />
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
    <div class="book-skeleton" v-if="loading.page || loading.recommended">
      <book-skeleton :skeleton-type="'horizontal'" />
    </div>
    <horizontal-scroll v-else :books="recommendedBooks" @select-book="handleBookSelect"/>
  </div>
  <div class="search-view">
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
    <div class="book-skeleton" v-if="loading.page || loading.discover">
      <book-skeleton :skeleton-type="'vertical'" />
    </div>
    <book-grid v-else :books="filteredBooks" @select-book="handleBookSelect"/>
    <div v-if="loading.more" class="load-more">
      <TextLoader loader-text="Loading more books..."/>
    </div>
    <div ref="bottomRef" class="bottom-observer"></div>
  </div>
  <book-sidebar 
    v-if="sidebar.open"
    :bookId="sidebar.bookId"
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
