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
@import "@/styles/variables.scss";

.action-tab {
  background-color: $main-bgcolor;
  border-radius: 6px;
  padding: 1.5rem;
  box-shadow: $small-shadow;
  min-height: 200px;
}
</style>