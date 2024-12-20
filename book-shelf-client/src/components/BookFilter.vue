<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  filterValue: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['deleted-filter']);

function handleDelete() {
  emit('deleted-filter', props.filterValue);
}
</script>

<template>
  <div class="book-filter">
    <span id="filterValue">{{ props.filterValue }}</span>
    <button class="cross-button" aria-label="Remove filter" @click="handleDelete">
      <i class="fa-solid fa-xmark cross-icon"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.book-filter {
  font-weight: 600;
  display: flex;
  align-items: center;
  padding: 5px 15px;
  background-color: #dddaf8;
  border-radius: 20px;
  gap: 10px;
}

.cross-button {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cross-icon {
  font-size: 1.4rem;
}
</style>
