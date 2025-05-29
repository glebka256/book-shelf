<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";

const props = defineProps({
  currentSearch: {
    type: String,
    required: false,
    default: ''
  }
});

const emit = defineEmits(["input:submit", "input:clear"]);

const searchQuery = ref(props.currentSearch);

const handleSearchInput = (): void => {
  emit("input:submit", searchQuery);
}

const clearSearch = (): void => {
  searchQuery.value = '';
  emit("input:submit", searchQuery);
}
</script>

<template>
  <div class="search-input">
    <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd"
        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
        clip-rule="evenodd" />
    </svg>
    <input type="text" v-model="searchQuery" @input="handleSearchInput" placeholder="Search books..."
      class="search-input" />
    <button v-if="searchQuery" @click="clearSearch" class="clear-search-btn" type="button">
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.search-input {
  position: relative;
  display: flex;
  align-items: center;

  .search-icon {
    position: absolute;
    left: 0.75rem;
    width: 1.25rem;
    height: 1.25rem;
    color: $main-gray-bgcolor;
    pointer-events: none;
    z-index: 1;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 2.75rem 0.75rem 2.5rem;
    border: 2px solid $main-border-color;
    border-radius: 0.5rem;
    font-size: 0.95rem;
    font-family: $main-font;
    background-color: $main-bgcolor;
    color: $main-thick-font;
    transition: all 0.2s ease;

    &::placeholder {
      color: $main-gray-bgcolor;
    }

    &:focus {
      outline: none;
      border-color: $btn-bgcolor;
      box-shadow: $sec-light-shadow;
    }
  }

  .clear-search-btn {
    position: absolute;
    right: 0.5rem;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: $main-gray-bgcolor;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      color: $sec-thick-font;
      background-color: rgba(156, 163, 175, 0.1);
    }

    svg {
      width: 1rem;
      height: 1rem;
    }
  }
}
</style>