<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>

<template>
  <div class="modal-header">
    <h1 class="modal-title">{{ props.title }}</h1>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.modal-header {
  text-align: center;
  margin-bottom: 2rem;

  .modal-title {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0;
    background: linear-gradient(
      135deg,
      #667eea 0%,
      #764ba2 50%,
      #667eea 100%
    );
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientText 4s ease-in-out infinite;
    text-shadow: 0 0 30px rgba(103, 126, 234, 0.3);
    letter-spacing: -0.02em;

    @media (max-width: $small-width) {
      font-size: 2rem;
    }
  }
}

@keyframes gradientText {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>