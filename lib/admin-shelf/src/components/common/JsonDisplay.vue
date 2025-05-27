<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  jsonData: unknown
}>();

const copyToClipboard = () => {
  if (!props.jsonData) return;
  
  const jsonString = JSON.stringify(props.jsonData, null, 2);
  navigator.clipboard.writeText(jsonString)
    .then(() => {
      alert('JSON data copied to clipboard!');
    })
    .catch(err => {
      alert('Failed to copy text');
      console.error('Failed to copy text', err);
    });
};
</script>

<template>
  <div class="json-display">
    <div class="json-display__header">
      <h2 class="json-display__title">Book Data</h2>
      <button 
        @click="copyToClipboard" 
        class="button button--small"
      >
        Copy JSON
      </button>
    </div>
    
    <pre class="json-content">{{ JSON.stringify(props.jsonData, null, 2) }}</pre>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.json-display {
  background-color: $json-bg-color;
  border: 1px solid $json-border-color;
  border-radius: 4px;
  overflow: hidden;
  text-align: left;
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background-color: $json-border-color;
  }
  
  &__title {
    margin: 0;
    font-size: 1.2rem;
    color: $main-thick-font;
  }

  .json-content {
    margin: 0;
    padding: 1rem;
    background-color: $json-bg-color;
    overflow-x: auto;
    font-family: monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    white-space: pre-wrap;
    text-align: left;
  }
}
</style>