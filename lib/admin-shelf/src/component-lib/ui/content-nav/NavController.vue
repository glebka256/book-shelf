<script setup lang="ts">
import SearchInput from './SearchInput.vue';

</script>

<template>
  <div class="nav-controls">
    <div class="search-contatiner">
      <SearchInput />
    </div>
    <div class="sort-contatiner"></div>
  </div>
</template>

<style scoped lang="scss">
.nav-controls {
  display: flex;
  align-items: center;
  gap: 1rem;

  .search-container {
    min-width: 280px;
  }

  .sort-container {
    position: relative;
  }
}
</style>