<script setup lang="ts">
import { defineProps } from 'vue';
import LoadingSpinner from '@/components/common/loaders/LoadingSpinner.vue';

const props = defineProps({
  loaderText: {
    type: String,
    required: true
  }
});
</script>

<template>
<div class="text-loader">
    <LoadingSpinner />
    <p>{{ props.loaderText }}</p>
  </div>
</template>

<style scoped lang="scss">
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