<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
import SearchBar from '@/components/SearchBar.vue';
import BookSkeleton from '@/components/BookSkeleton.vue';
import CommonButton from '@/components/CommonButton.vue';
import HorizontalScroll from '@/components/HorizontalScroll.vue';
import IconButton from '@/components/IconButton.vue';
import FilterForm from '@/components/FilterForm.vue';
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
  if (!isLoading.value) {
    adjustFilterGrid();
  }

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
          <common-button>Reset Filter</common-button>
          <common-button>Apply Filter</common-button>
        </div>
      </div>
      <filter-form />
      <div class="heading-row">
        <div class="filters-view" ref="filterGrid">
          <!--
          <book-filter 
            v-for="category in selectedCategories" v-bind:key="category"
            :filter-value="category"
            @deleted-filter="deleteCategory"
          -->
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

.filters-view {
  width: 100%;
  display: grid;
  justify-content: start;
  gap: 15px;
  padding: 15px;
}

@media (max-width: 1084px) {
  .heading-row {

    &.applied-shrink {
      flex-direction: column;
    }

    &.applied-margin {
      margin-bottom: 0;
    }

    .heading-cell {
      margin-bottom: 14px;
      margin-right: auto;
    }
  }
}
</style>
