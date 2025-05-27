<script setup lang="ts">
import { withDefaults, defineProps, defineEmits, computed } from 'vue';

interface Props {
  currentPage: number;
  totalPages: number;
  visiblePages?: number;
}

const props = withDefaults(defineProps<Props>(), {
  visiblePages: 3
});

const emit = defineEmits<{
  (e: 'leftPageClick'): void;
  (e: 'rightPageClick'): void;
  (e: 'pageClick', page: number): void;
}>();

// Calculate which page numbers should be displayed
const displayedPages = computed(() => {
  const pages: number[] = [];
  const { currentPage, totalPages, visiblePages } = props;

  // Always add first page
  pages.push(1);

  // Calculate range of pages to show around current page
  let rangeStart = Math.max(2, currentPage - Math.floor(visiblePages / 2));
  let rangeEnd = Math.min(totalPages - 1, rangeStart + visiblePages - 1);

  // Adjust start if we're near the end
  if (rangeEnd === totalPages - 1) {
    rangeStart = Math.max(2, rangeEnd - visiblePages + 1);
  }

  // Add ellipsis after first page if needed
  if (rangeStart > 2) {
    pages.push(-1); // -1 represents ellipsis
  }

  // Add range of pages
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  // Add ellipsis before last page if needed
  if (rangeEnd < totalPages - 1) {
    pages.push(-2); // -2 represents ellipsis (different key than the first one)
  }

  // Always add last page if there are more than one page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
});

const isCurrentPage = (page: number): boolean => page === props.currentPage;

const handlePageClick = (page: number): void => {
  if (page !== props.currentPage && page > 0) {
    emit('pageClick', page);
  }
};

const handlePrevClick = (): void => {
  if (props.currentPage > 1) {
    emit('leftPageClick');
  }
};

const handleNextClick = (): void => {
  if (props.currentPage < props.totalPages) {
    emit('rightPageClick');
  }
};
</script>

<template>
  <nav class="pagination" aria-label="Pagination">
    <ul class="pagination-list">
      <!-- Previous page button -->
      <li class="pagination-item">
        <button 
          class="pagination-button pagination-nav" 
          :class="{ 'disabled': currentPage <= 1 }"
          :disabled="currentPage <= 1"
          @click="handlePrevClick"
          aria-label="Go to previous page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pagination-icon">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </li>

      <!-- Page numbers -->
      <li v-for="page in displayedPages" :key="page" class="pagination-item">
        <template v-if="page === -1 || page === -2">
          <span class="pagination-ellipsis">&hellip;</span>
        </template>
        <template v-else>
          <button 
            class="pagination-button pagination-number" 
            :class="{ 'active': isCurrentPage(page) }"
            @click="handlePageClick(page)"
            :aria-current="isCurrentPage(page) ? 'page' : undefined"
            :aria-label="`Go to page ${page}`"
          >
            {{ page }}
          </button>
        </template>
      </li>

      <!-- Next page button -->
      <li class="pagination-item">
        <button 
          class="pagination-button pagination-nav" 
          :class="{ 'disabled': currentPage >= totalPages }"
          :disabled="currentPage >= totalPages"
          @click="handleNextClick"
          aria-label="Go to next page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pagination-icon">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.pagination {
  margin: 2rem 0;
}

.pagination-list {
  display: flex;
  align-items: center;
  justify-content: center;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.pagination-item {
  margin: 0 0.25rem;
}

.pagination-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: #ffffff;
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(.disabled):not(.active) {
    background-color: #f7fafc;
    color: #2d3748;
  }

  &.active {
    background-color: #4299e1;
    color: white;
    border-color: #4299e1;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.pagination-nav {
  padding: 0.5rem;
}

.pagination-icon {
  width: 1rem;
  height: 1rem;
}

.pagination-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  color: #a0aec0;
}

@media (max-width: 480px) {
  .pagination-item:not(:first-child):not(:last-child) {
    &:nth-child(n+4):nth-child(-n+8) {
      display: none;
    }
  }
}
</style>