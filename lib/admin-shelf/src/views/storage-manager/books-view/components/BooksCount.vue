<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  totalBooks: {
    type: Number,
    required: true
  }
});
</script>

<template>
  <div class="books-count">
    <span class="count-number">{{ props.totalBooks }}</span>
    <span class="count-label">{{ props.totalBooks === 1 ? 'Book' : 'Books' }}</span>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.books-count {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;

  .count-number {
    font-size: 1.8rem;
    font-weight: $med-thick;
    color: $main-thick-font;
    line-height: 1;
  }

  .count-label {
    font-size: 1.1rem;
    color: $sec-thick-font;
    font-weight: $med-weight;
  }
}
</style>