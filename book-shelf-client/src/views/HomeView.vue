<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SearchBar from '@/components/SearchBar.vue';
import BookSkeleton from '@/components/BookSkeleton.vue';
import CommonButton from '@/components/CommonButton.vue';
import HorizontalScroll from '@/components/HorizontalScroll.vue';
import IconButton from '@/components/IconButton.vue';
import FilterForm from '@/components/FilterForm.vue';
import BookGrid from '@/components/BookGrid.vue';
import { Book } from '@/types/Book';
import baseInstance from '@/api/baseInstance';

const recommendedBooks = ref<Book[]>([]);
const popularBooks = ref<Book[]>([]);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

async function fetchPopularBooks(page: number, limit: number): Promise<void> {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    const response = await baseInstance.get<Book[]>(
      `/books/popular/${page}/${limit}`
    );
    popularBooks.value = response.data;
    recommendedBooks.value = popularBooks.value;
  } catch (error) {
    errorMessage.value = `Could not fetch popular books. Error: ${error}`;
  } finally {
    isLoading.value = false;
  }
}

function handleFilterReset() {
  // TODO: need to call resetFilters function in FilterForm
}

function handleFilterSubmit() {
  // TODO: should get selectedFilters from FilterForm
}

onMounted(() => {
  fetchPopularBooks(1, 50);
});
</script>

<template>
 <div class="home-view">
  <div class="empty-top"></div>
  <search-bar placeholder="Search book" />
  <div class="book-sceleton" v-if="isLoading">
    <book-skeleton :skeleton-type="'horizontal'" />
  </div>
  <div v-else class="recommended-view">
    <div class="view-heading">
      <div class=heading-row>
        <div class="recommended-title-wrapper">
          <h2 class="view-title">Recommended</h2>
          <icon-button icon-type="reset" />
        </div>
        <div class="view-options">
          <common-button>See All</common-button>
        </div>
      </div>
    </div>
    <horizontal-scroll :books="recommendedBooks"/>
  </div>
  <div class="book-sceleton" v-if="isLoading">
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
      <filter-form />
    </div>
    <book-grid :books="popularBooks"/>
  </div>
 </div>
</template>

<style scoped lang="scss">
.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-top {
  height: 100px;
}

.book-sceleton {
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
</style>
