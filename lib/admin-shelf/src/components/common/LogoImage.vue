<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  width: {
    type: Number,
    required: true
  }
});
</script>

<template>
  <img 
    class="logo-image" 
    :style="{ width: props.width + 'px' }"
    src="../../assets/logo.png" 
    alt="Book Shelf logo" 
  />
</template>

<style scoped lang="scss">
.logo-image {
  height: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}
</style>