<script setup lang="ts">
import BookCard from './BookCard.vue';
</script>

<template>
 <div class="scroll-view">
  <book-card />
  <book-card />
  <book-card />
  <book-card />
  <book-card />
  <book-card />
  <book-card />
  <book-card />
 </div>
</template>

<style scoped lang="scss">
.scroll-view {
  display: flex;
  flex-direction: row;
  
}
</style>