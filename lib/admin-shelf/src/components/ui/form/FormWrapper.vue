<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: ''
  }
});
</script>

<template>
  <div class="form-section">
    <h3 v-if="props.title">{{ props.title }}</h3>
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  h3 {
    margin-bottom: 1rem;
    color: #444;
    font-weight: 500;
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.5rem;
  }
  
  h4 {
    margin: 1rem 0;
    color: #555;
    font-weight: 500;
  }
}
</style>