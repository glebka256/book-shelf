<script setup lang="ts">
import { defineProps, PropType, computed } from 'vue';

const props = defineProps({
  iconType: {
    type: String as PropType<'reset'>,
    required: true
  },
  iconSize: {
    type: Number,
    required: false,
    default: 1.4
  }
});

const iconClass = computed(() => {
  return props.iconType === 'reset' ? 'fa-solid fa-rotate' : '';
});
</script>

<template>
  <button class="icon-button">
    <i :class="iconClass" :style="{ fontSize: `${iconSize}rem` }"></i>
  </button>
</template>

<style scoped lang="scss">
button {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  color: #2c3e50;
}
</style>
