<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  filterValue: {
    type: String,
    required: true
  },
  deleteEnabled: {
    type: Boolean,
    required: true
  },
  color: {
    type: String,
    required: false,
    default: '#dddaf8'
  }
});

const emit = defineEmits(['deleted-filter']);

function handleDelete() {
  emit('deleted-filter', props.filterValue);
}
</script>

<template>
  <div class="book-filter" :style="{ backgroundColor: props.color }">
    <span class="filterValue">{{ props.filterValue }}</span>
    <button 
      v-if="props.deleteEnabled" 
      class="cross-button" 
      aria-label="Remove filter" 
      @click="handleDelete"
    >
      <i class="fa-solid fa-xmark cross-icon"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.book-filter {
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 20px;
  gap: 10px;
}

.filter-value {
  align-self: flex-start;
}

.cross-button {
  all: unset;
  cursor: pointer;
  display: flex;
  align-self: flex-end;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.cross-icon {
  font-size: 1.4rem;
}
</style>
