<script setup lang="ts">
import { defineProps } from 'vue';
defineProps({
  text: {
    type: String,
    required: true
  }
});
</script>

<template>
  <button class="common-button">{{ text }}</button>
</template>

<style scoped lang="scss">
.common-button {
  padding: 8px 16px;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  background-color: #7175d1;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #5c60c0;
  }

  &:active {
    background-color: #4a4eaf;
    transform: scale(0.95);
  }
}
</style>