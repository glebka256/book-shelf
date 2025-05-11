<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  linkLabel: {
    type: String,
    required: false,
    default: ''
  },
  link: {
    type: String,
    required: true
  }
});
</script>

<template>
 <div class="suggestion-card">
  <p>{{ props.message }}</p>
  <router-link :to="link">{{ props.linkLabel }}</router-link>
 </div>
</template>

<style scoped lang="scss">
.search-template {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
  margin: 20px auto;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
}
</style>
