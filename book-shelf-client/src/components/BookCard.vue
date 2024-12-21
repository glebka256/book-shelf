<script setup lang="ts">
import { defineProps, PropType, computed } from 'vue';
import { Book } from '@/types/Book';

const props = defineProps({
  book: {
    type: Object as PropType<Book>,
    required: true
  }
});

const bookCover = computed(() => {
  return props.book.coverUrl || '@/assets/cover_placeholder.png';
});
</script>

<template>
 <div class="book-card">
  <div class="book-container">
    <div class="image-cover">
      <img :src="bookCover">
    </div>
    <div class="image-props">
      <h3 class="title">{{ props.book.title }}</h3>
      <h4 class="author">{{ props.book.author }}</h4>
    </div>
  </div>
 </div>
</template>

<style scoped lang="scss">
.book-card {
  display: flex;
  justify-content: center;
  align-items: center;
}

.book-container {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  width: 200px;
  height: 420px;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
  }
}

.image-cover {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f4f4;
  width: 100%;
  height: 90%;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.image-props {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 8px;
  padding: 0 5px;

  .title {
    font-size: 1rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 2px;
  }

  .author {
    font-size: 0.9rem;
    font-weight: 400;
    color: #7f8c8d;
  }
}
</style>
