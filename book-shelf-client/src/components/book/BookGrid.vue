<script setup lang="ts">
import BookCard from '@/components/book/BookCard.vue';
import { defineProps, defineEmits, PropType } from 'vue';
import { Book } from '@/types/Book';

const props = defineProps({
  books: {
    type: Array as PropType<Book[]>,
    required: true
  }
});

const emit = defineEmits(['select-book']);

function onBookSelect(bookId: string) {
  emit('select-book', bookId);
}
</script>

<template>
 <div class="grid-container">
  <div class="grid-item" v-for="book in props.books" :key="book._id" :value="book">
    <book-card :book="book" @selectBook="onBookSelect"/>
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