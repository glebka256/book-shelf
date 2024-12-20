<script setup lang="ts">
import BookCard from './BookCard.vue';
</script>

<template>
 <div class="grid-container">
  <div class="grid-item" v-for="i in 10" :key="i">
    <book-card />
  </div>
 </div>
</template>

<style scoped lang="scss">
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  justify-items: center;
  padding-left: 15px;
  padding-right: 15px;
}

.grid-item {
  margin-bottom: 10px;
}
</style>