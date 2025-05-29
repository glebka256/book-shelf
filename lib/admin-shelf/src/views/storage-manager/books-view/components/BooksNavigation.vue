<script setup lang="ts">
import { withDefaults, ref, defineEmits, defineProps, onMounted, onUnmounted } from 'vue';
import BooksCount from './BooksCount.vue';
import NavController from '@/component-lib/ui/content-nav/NavController.vue';

interface Props {
  totalBooks: number;
  currentSort?: string;
  currentSearch?: string;
}

const props = withDefaults(defineProps<Props>(), {
  currentSort: 'title-asc',
  currentSearch: ''
});

const emit = defineEmits<{
  search: [query: string];
  sort: [sortBy: string];
}>();

const searchQuery = ref(props.currentSearch);
const currentSort = ref(props.currentSort);
const isSortOpen = ref(false);

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

const getCurrentSortLabel = (): string => {
  const option = sortOptions.find(opt => opt.value === currentSort.value);
  return option ? option.label : 'Sort by';
};

const handleSearchInput = (): void => {
  // empty
};

const toggleSortDropdown = (): void => {
  isSortOpen.value = !isSortOpen.value;
};

const handleSortChange = (sortValue: string): void => {
  currentSort.value = sortValue;
  isSortOpen.value = false;
  emit('sort', sortValue);
};

const handleClickOutside = (event: Event): void => {
  const target = event.target as HTMLElement;
  if (!target.closest('.sort-dropdown')) {
    isSortOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="books-navigation">
    <div class="nav-header">
      <BooksCount :totalBooks="props.totalBooks"/>
      <NavController />
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
  }
}
</style>