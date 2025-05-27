<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  label: String,
  value: Number
});
</script>

<template>
  <div class="stat-card">
    <h3>{{ props.label }} <slot></slot></h3>
    <span class="stat-value">{{ props.value }}</span>
  </div>
</template>

<style scoped lang="scss">
.stat-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 600;
    color: #666;
  }
  
  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
}
</style>