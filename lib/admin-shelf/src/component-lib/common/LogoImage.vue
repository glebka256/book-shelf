<script setup lang="ts">
import { defineProps } from "vue";

/**
 * LogoImage Component
 * 
 * A reusable component that displays the Book Shelf logo with custom width.
 * The image has a shadow effect and scales up slightly on hover.
 * 
 * @displayName LogoImage
 * @example
 * <LogoImage :width="150" />
 */

const props = defineProps({
    /**
   * The width of the logo in pixels.
   * Height will be automatically calculated to maintain aspect ratio.
   * @type {number}
   * @required
   */
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

<style lang="scss">
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