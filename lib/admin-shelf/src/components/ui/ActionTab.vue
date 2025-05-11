<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  tabId: string;
  activeTab: string;
}>();

// Computed property determines if component is displayed
const isActive = () => props.tabId === props.activeTab;
</script>

<template>
  <div class="action-tab" v-if="isActive()">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.action-tab {
  background-color: white;
  border-radius: 6px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  min-height: 200px;
}
</style>