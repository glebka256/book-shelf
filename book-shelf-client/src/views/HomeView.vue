<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
import SearchBar from '@/components/SearchBar.vue';
import CommonButton from '@/components/CommonButton.vue';
import HorizontalScroll from '@/components/HorizontalScroll.vue';
import InputSelector from '@/components/InputSelector.vue';
import BookGrid from '@/components/BookGrid.vue';
import BookFilter from '@/components/BookFilter.vue';
import { calculateTextWidth } from '@/utils';
import { Book } from '@/types/Book';
import baseInstance from '@/api/baseInstance';

const recommendedBooks = ref<Book[]>([]);
const popularBooks = ref<Book[]>([]);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

const categories = ref<string[]>(["fiction", "non-fiction", "science", "fantasy","epic_fantasy", "dark_fantasy", "mystery", "romance", "thriller", "horror", "historical_fiction", "science_fiction", "literary_fiction", "young_adult", "children's_books", "classics", "adventure", "crime", "paranormal", ]);
const selectedCategories = ref<string[]>([]);

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

function addCategory(category: string) {
  if (!selectedCategories.value.includes(category)) {
    selectedCategories.value.push(category);

    const index = categories.value.indexOf(category);
    if (index !== -1) {
      categories.value.splice(index, 1);
    }
  }
}

function deleteCategory(category: string) {
  if (selectedCategories.value.includes(category)) {
    const index = selectedCategories.value.indexOf(category);
    if (index !== -1) {
      selectedCategories.value.splice(index, 1);
    }

    categories.value.push(category);
  }
}

const filterGrid = ref<HTMLDivElement | null>(null);

// A big hack but seems to work for now
const adjustFilterGrid = () => {
  if (filterGrid.value) {
    const grid = filterGrid.value as HTMLDivElement;

    // Getting supposed width of each element to find out how many can fit
    const fontFamily = "Avenir, Helvetica, Arial, sans-serif";
    const elementsWidth = selectedCategories.value.map(category => {
      const labelWidth = calculateTextWidth(category, 16, fontFamily);
      const iconOffset = 45;  // Assuming an icon width/offset for each item
      return labelWidth + iconOffset;
    });

    const containerWidth = grid.offsetWidth;
    // Taking padding into consideration so that elements don't get smaller than they are
    const columnElementPadding = 15;

    const itemsPerRow = Math.max(1, Math.floor(containerWidth / (Math.max(...elementsWidth) + columnElementPadding)));

    const rowOffsets: string[] = [];
    for (let i = 0; i < selectedCategories.value.length; i++) {
      const isOddRow = Math.floor(i / itemsPerRow) % 2 === 1;
      rowOffsets.push(isOddRow ? '20px' : '0px');
    }

    selectedCategories.value.forEach((category, index) => {
      const row = Math.floor(index / itemsPerRow);
      const column = index % itemsPerRow;
      const item = grid.children[index] as HTMLElement;

      if (item) {
        item.style.gridRow = `${row + 1}`;
        item.style.gridColumn = `${column + 1}`;
        item.style.transform = `translateX(${rowOffsets[index]})`; // Offset applied to make rows stand out
      }
    });
  }
};

onMounted(() => {
  fetchPopularBooks(1, 50);

  nextTick(() => {
    adjustFilterGrid();
  });

  window.addEventListener('resize', adjustFilterGrid);
});

watch(selectedCategories, async () => {
    await nextTick();
    adjustFilterGrid();
  },
  { deep: true }
);

onBeforeUnmount(() => {
  window.removeEventListener('resize', adjustFilterGrid);
});
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
    <horizontal-scroll :books="recommendedBooks"/>
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
        <div class="filters-view" ref="filterGrid">
          <book-filter 
            v-for="category in selectedCategories" v-bind:key="category"
            :filter-value="category"
            @deleted-filter="deleteCategory"
          />
        </div>
      </div>
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
  width: 100%;
  display: grid;
  justify-content: start;
  gap: 15px;
  padding: 15px;
}
</style>
