<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

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

const emit = defineEmits(['edit', 'remove']);

const handleEdit = () => emit('edit');
const handleRemove = () => emit('remove');
</script>

<template>
  <div class="book-cover">
    <img :src="props.coverUrl" :alt="props.title" class="cover-image" />
    
    <div class="book-status">
      <span v-if="props.complete" class="status complete">Complete</span>
      <span v-else class="status incomplete">Incomplete</span>
    </div>

    <div class="book-actions">
      <button 
        class="action-btn edit-btn" 
        @click.stop="handleEdit" 
        title="Edit book"
      >
        <span class="action-icon"><i class="fa-solid fa-pencil"></i></span>
      </button>
      <button 
        class="action-btn delete-btn" 
        @click.stop="handleRemove" 
        title="Delete book"
      >
        <span class="action-icon"><i class="fa-solid fa-trash"></i></span>
      </button>
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

  .book-actions {
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    gap: 16px;
    opacity: 0;
    transition: opacity 0.2s ease;

    .action-btn {
      background-color: rgba(255, 255, 255, 0.95);
      border-radius: 6px;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
      transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;

      &:hover {
        transform: translateY(-3px);
        border-color: #888;
      }

      &.delete-btn:hover, &.edit-btn:hover {
        background-color: rgba(244, 67, 54, 0.1);
      }

      .action-icon {
        font-size: 20px;
        color: #333;
      }
    }
  }
  
  &:hover .book-actions {
    opacity: 1;
  }
}
</style>