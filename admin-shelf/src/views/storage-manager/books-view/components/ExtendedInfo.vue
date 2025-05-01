<script setup lang="ts">
import { defineProps, PropType } from 'vue';
import { BookLink } from "@/types/Book.types";
import BookTags from './BookTags.vue';

const props = defineProps({
  bookLanguages: {
    type: Array as PropType<string[]>,
    required: true
  },
  bookSubjects: {
    type: Array as PropType<string[]>,
    required: true
  },
  bookLink: {
    type: Object as PropType<BookLink>,
    required: false,
    defualt: undefined
  }
});
</script>

<template>
  <div class="extended-info">
    <BookTags 
      title="Languages:"
      :tags="props.bookLanguages"
    />

    <BookTags 
      title="Subjects:"
      :tags="props.bookSubjects.slice(0, 5)"
    />
    
    <div v-if="props.bookLink" class="book-actions">
      <a 
        :href="props.bookLink.readUrl" 
        target="_blank" 
        class="action-btn read-btn"
      >
        Read Online
      </a>
      <a 
        :href="props.bookLink.downloadUrl" 
        target="_blank" 
        class="action-btn download-btn"
      >
        Download {{ props.bookLink.format.toUpperCase() }} ({{ props.bookLink.size.value }}{{ props.bookLink.size.metric }})
      </a>
      <a 
        :href="props.bookLink.buyUrl" 
        target="_blank" 
        class="action-btn buy-btn"
      >
        Buy Book
      </a>
    </div>
    <div v-else class="book-actions">
      <span class="no-links">No download links available</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.extended-info {
  padding: 0.5rem 1rem 1rem;
  border-top: 1px solid #eee;

  .book-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1rem;
    
    .action-btn {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 500;
      text-decoration: none;
      text-align: center;
      flex: 1;
      min-width: 120px;
      transition: background-color 0.2s ease;
      
      &.read-btn {
        background-color: #3b82f6;
        color: white;
        
        &:hover {
          background-color: #2563eb;
        }
      }
      
      &.download-btn {
        background-color: #10b981;
        color: white;
        
        &:hover {
          background-color: #059669;
        }
      }
      
      &.buy-btn {
        background-color: #f59e0b;
        color: white;
        
        &:hover {
          background-color: #d97706;
        }
      }
    }
    
    .no-links {
      padding: 0.5rem;
      color: #64748b;
      font-style: italic;
      text-align: center;
      width: 100%;
    }
  }
}
</style>