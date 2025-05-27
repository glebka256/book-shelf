<script setup lang="ts">
import { defineProps, PropType, computed } from 'vue';

const props = defineProps({
  iconType: {
    type: String as PropType<'reset' | 'add' | 'remove'>,
    required: true
  },
  iconSize: {
    type: Number,
    required: false,
    default: 1.4
  }
});

const iconClass = computed(() => {
  let iconClass: string;

  if (props.iconType === 'reset') {
    iconClass = 'fa-solid fa-rotate';
  } 
  else if (props.iconType === 'add') {
    iconClass = 'fa-solid fa-plus-circle';
  } 
  else if (props.iconType === 'remove') {
    iconClass = 'fa-solid fa-minus-circle';
  } else {
    iconClass = 'fa-solid fa-rotate';
  }

  return iconClass;
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