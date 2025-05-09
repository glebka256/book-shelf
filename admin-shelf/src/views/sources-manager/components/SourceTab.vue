<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  sourceName: {
    type: String,
    requireed: true
  },
  searchPlaceholder: {
    type: String,
    required: false,
    default: "Enter book title, author, or ISBN"
  }
});
</script>

<template>
 <div class="source-tab">
  <div class="source-tab-header">
    <h3 class="tab-title">Book Source: {{ props.sourceName }}</h3>
  </div>
 </div>
</template>

<style scoped lang="scss">
.source-tab {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arial', sans-serif;

  .source-tab-header {
    margin-bottom: 2rem;
    text-align: center;

    h3 {
      font-size: 1.8rem;
      color: #333;
      margin: 0;
    }
  }
}
</style>