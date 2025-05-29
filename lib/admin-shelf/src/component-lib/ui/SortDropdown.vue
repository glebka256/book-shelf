<script setup lang="ts">
import { defineProps, PropType, defineEmits, ref, onMounted, onUnmounted } from "vue";

export interface SortOption {
  value: string,
  label: string
}

const props = defineProps({
  sortOptions: {
    type: Array as PropType<SortOption[]>,
    required: true
  },
  defaultSort: {
    type: String,
    required: false,
    default: undefined
  }
});

const emit = defineEmits(['sort']);

const currentSort = ref<string>(
  props.defaultSort || (props.sortOptions.length > 0 ? props.sortOptions[0].value : '')
);

const isSortOpen = ref(false);

const toggleSortDropdown = (): void => {
  isSortOpen.value = !isSortOpen.value;
};

const getCurrentSortLabel = (): string => {
  const option = props.sortOptions.find(opt => opt.value === currentSort.value);
  return option ? option.label : 'Sort by';
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
  <div class="sort-dropdown" :class="{ 'open': isSortOpen }">
    <button @click="toggleSortDropdown" class="sort-trigger" type="button">
      <svg class="sort-icon" viewBox="0 0 20 20" fill="currentColor">
        <path
          d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z" />
      </svg>
      <span>{{ getCurrentSortLabel() }}</span>
      <svg class="dropdown-arrow" :class="{ 'rotated': isSortOpen }" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd" />
      </svg>
    </button>

    <div v-if="isSortOpen" class="sort-options">
      <button v-for="option in sortOptions" :key="option.value" @click="handleSortChange(option.value)"
        class="sort-option" :class="{ 'active': currentSort === option.value }" type="button">
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.sort-dropdown {
  position: relative;

  .sort-trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background-color: $main-bgcolor;
    border: 2px solid $main-border-color;
    border-radius: 0.5rem;
    color: $main-thick-font;
    font-size: 0.95rem;
    font-family: $main-font;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 160px;
    justify-content: space-between;

    &:hover {
      border-color: $btn-bgcolor;
    }

    .sort-icon {
      width: 1.25rem;
      height: 1.25rem;
      color: $main-gray-bgcolor;
    }

    .dropdown-arrow {
      width: 1rem;
      height: 1rem;
      color: $main-gray-bgcolor;
      transition: transform 0.2s ease;

      &.rotated {
        transform: rotate(180deg);
      }
    }
  }

  &.open .sort-trigger {
    border-color: $btn-bgcolor;
    box-shadow: $sec-light-shadow;
  }
}

.sort-options {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  background-color: $main-bgcolor;
  border: 2px solid $main-border-color;
  border-radius: 0.5rem;
  box-shadow: $normal-shadow;
  z-index: 10;
  overflow: hidden;

  .sort-option {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    text-align: left;
    color: $main-thick-font;
    font-size: 0.95rem;
    font-family: $main-font;
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: rgba(79, 70, 229, 0.05);
    }

    &.active {
      background-color: rgba(79, 70, 229, 0.1);
      color: $btn-bgcolor;
      font-weight: $med-thick;
    }

    &:not(:last-child) {
      border-bottom: 1px solid rgba(224, 224, 224, 0.5);
    }
  }
}

@media (max-width: $smallest-width) {
  .sort-trigger {
    padding: 0.625rem 0.75rem;
    font-size: 0.9rem;
  }
}
</style>