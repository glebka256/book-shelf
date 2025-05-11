<script setup lang="ts">

</script>

<template>
  <div class="loading-spinner">
    <i class="fas fa-spinner"></i>
  </div>
</template>

<style scoped lang="scss">
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666;

  i {
    font-size: 24px;
    margin-bottom: 10px;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>