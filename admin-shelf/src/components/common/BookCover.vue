<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  coverUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  complete: {
    type: Boolean,
    required: true
  }
});
</script>

<template>
  <div class="book-cover">
    <img :src="props.coverUrl" :alt="props.title" class="cover-image" />
    <div class="book-status">
      <span v-if="props.complete" class="status complete">Complete</span>
      <span v-else class="status incomplete">Incomplete</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.book-cover {
  position: relative;
  width: 100%;
  height: 320px;
  overflow: hidden;
  
  .cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.03);
    }
  }
  
  .book-status {
    position: absolute;
    top: 10px;
    right: 10px;
    
    .status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      
      &.complete {
        background-color: #4caf50;
        color: white;
      }
      
      &.incomplete {
        background-color: #ff9800;
        color: white;
      }
    }
  }
}
</style>