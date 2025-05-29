<script setup lang="ts">
import { withDefaults, defineProps, defineEmits } from 'vue';

import BooksCount from './BooksCount.vue';
import SearchInput from '@/component-lib/ui/SearchInput.vue';
import SortDropdown from '@/component-lib/ui/SortDropdown.vue';

interface Props {
  totalBooks: number;
  currentSort?: string;
  currentSearch?: string;
}

const props = withDefaults(defineProps<Props>(), {
  currentSort: 'title-asc',
  currentSearch: ''
});

const emit = defineEmits(['search', 'sort']);

const sortOptions = [
  { value: 'title-asc', label: 'Title A-Z' },
  { value: 'title-desc', label: 'Title Z-A' },
  { value: 'author-asc', label: 'Author A-Z' },
  { value: 'author-desc', label: 'Author Z-A' },
  { value: 'date-newest', label: 'Newest First' },
  { value: 'date-oldest', label: 'Oldest First' },
  { value: 'pages-asc', label: 'Pages (Low to High)' },
  { value: 'pages-desc', label: 'Pages (High to Low)' }
];

const handleSearchInput = (searchQuery: string): void => {
  emit('search', searchQuery);
};

const handleSortInput = (sortBy: string): void => {
  emit('sort', sortBy);
};
</script>

<template>
  <div class="books-navigation">
    <div class="nav-header">
      <BooksCount :totalBooks="props.totalBooks"/>

      <div class="nav-controls">
        <div class="search-container">
          <SearchInput 
            @input:submit="handleSearchInput"
          />
        </div>

        <div class="sort-container">
          <SortDropdown 
            :sortOptions="sortOptions"
            :defaultSort="sortOptions[0].value"
            @sort="handleSortInput"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";

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
}

@media (max-width: $smallest-width) {
  .nav-controls {
    gap: 0.5rem;
  }
}
</style>