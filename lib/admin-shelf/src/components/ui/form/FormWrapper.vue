<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: ''
  }
});
</script>

<template>
  <div class="form-section">
    <h3 v-if="props.title">{{ props.title }}</h3>
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: $main-darker-bgcolor;
  border-radius: 8px;
  box-shadow: $light-shadow;
  
  h3 {
    margin-bottom: 1rem;
    color: $main-thick-font;
    font-weight: $med-weight;
    border-bottom: 1px solid $main-border-color;
    padding-bottom: 0.5rem;
  }
  
  h4 {
    margin: 1rem 0;
    color: $sec-thick-font;
    font-weight: $med-weight;
  }
}
</style>