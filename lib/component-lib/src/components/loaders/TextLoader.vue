<script setup lang="ts">
import { defineProps } from 'vue';
import LoadSpinner from './LoadSpinner.vue';

const props = defineProps({
  loaderText: {
    type: String,
    required: true
  }
});
</script>

<template>
<div class="text-loader">
    <LoadSpinner />
    <p>{{ props.loaderText }}</p>
  </div>
</template>

<style lang="scss">
.text-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666;

  p {
    font-size: 16px;
    font-weight: 500;
  }
}
</style>