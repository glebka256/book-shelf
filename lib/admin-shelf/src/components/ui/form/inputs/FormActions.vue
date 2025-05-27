<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  onReset: () => void
}>()
</script>

<template>
  <div class="form-actions">
    <button type="button" @click="onReset" class="btn-secondary">Reset</button>
    <button type="submit" class="btn-primary">Submit</button>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  
  button {
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    
    &.btn-primary {
      background-color: $sec-btn-bgcolor;
      color: $main-bgcolor;
      border: none;
      
      &:hover {
        background-color: $sec-hover-bg-color;
      }
    }
    
    &.btn-secondary {
      background-color: $main-bgcolor;
      color: #333;
      border: 1px solid $main-border-color;
      
      &:hover {
        background-color: $main-darker-bgcolor;
      }
    }
  }
}
</style>