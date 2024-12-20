<script setup lang="ts">
import { ref } from 'vue';
import SearchBar from '@/components/SearchBar.vue';
import CommonButton from '@/components/CommonButton.vue';
import HorizontalScroll from '@/components/HorizontalScroll.vue';
import InputSelector from '@/components/InputSelector.vue';
import BookGrid from '@/components/BookGrid.vue';
import BookFilter from '@/components/BookFilter.vue';

const categories: Array<string> = [
  'Category1', 'Category2', 'Category3', 'Category4', 'Category5', 
  'Category6', 'Category7', 'Category8', 'Category9', 'Category10'
]
const selectedCategories = ref<string[]>([]);

function addCategory(category: string) {
  if (!selectedCategories.value.includes(category)) {
    selectedCategories.value.push(category);
  }
}

function deleteCategory(category: string) {
  if (selectedCategories.value.includes(category)) {
    const index = selectedCategories.value.indexOf(category);
    if (index !== -1) {
      selectedCategories.value.splice(index, 1);
    }
  }
}
</script>

<template>
 <div class="home-view">
  <search-bar placeholder="Search book" />
  <div class="recommended-view">
    <div class="view-heading">
      <div class=heading-row>
        <h2 class="view-title">Recommended</h2>
        <div class="view-options">
          <common-button>See All</common-button>
        </div>
      </div>
    </div>
    <horizontal-scroll></horizontal-scroll>
  </div>
  <div class="search-view">
    <div class="view-heading">
      <div class="heading-row">
        <h2 class="view-title">Discover new</h2>
        <div class="view-options">
          <input-selector 
            label-text="Category" 
            :options="categories"
            placeholder="Choose category" 
            @select-option="addCategory"
          />
        </div>
      </div>
      <div class="heading-row">
        <div class="filters-view">
          <book-filter 
            v-for="category in selectedCategories" v-bind:key="category"
            :filter-value="category"
            @deleted-filter="deleteCategory"
          />
        </div>
      </div>
    </div>
    <book-grid />
  </div>
 </div>
</template>

<style scoped lang="scss">
.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  background-color: #f5f6fa;
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

.view-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.view-options {
  display: flex;
  align-items: center;
}

.filters-view {
  display: flex;
  flex-direction: row;
  gap: 15px;
  padding: 15px;
}
</style>
