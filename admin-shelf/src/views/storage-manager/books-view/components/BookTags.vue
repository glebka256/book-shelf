<script setup lang="ts">
import { defineProps, PropType } from 'vue';

const props = defineProps({
  tags: {
    type: Array as PropType<string[]>,
    required: true
  },
  title: {
    type: String,
    required: false,
    default: ''
  }
});
</script>

<template>
 <div class="book-tags">
  <h4>{{ props.title }}</h4>
  <div class="tags-display">
    <span 
      v-for="(tag, index) in props.tags" 
      :key="index" 
      class="book-tag"
    >
      {{ tag }}
    </span>
    <span v-if="props.tags.length > 5" class="more-tag">+{{ props.tags.length - 5 }} more</span>
  </div>
 </div>
</template>

<style scoped lang="scss">
h4 {
  margin: 0.75rem 0 0.5rem;
  font-size: 0.9rem;
  color: #555;
}

.tags-display {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  
  .book-tag, .more-tag {
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    background-color: #f1f5f9;
    color: #475569;
  }
  
  .book-tag {
    background-color: #e0f2fe;
    color: #0369a1;
  }
  
  .more-tag {
    background-color: #e2e8f0;
    color: #64748b;
  }
}
</style>