<script setup lang="ts">
// Static component
import { defineProps } from 'vue';

const props = defineProps({
  borderColor: {
    type: String,
    required: false,
    default: "#000000"
  }
});
</script>

<template>
  <h2  
    class="section-title" 
    :style="{ borderBottom: `2px solid ${props.borderColor}` }"
  >
  <slot></slot>
 </h2>
</template>

<style lang="scss">
.section-title {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-top: 0;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
}
</style>