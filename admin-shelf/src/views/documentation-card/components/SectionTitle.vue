<script setup lang="ts">
// Static component
</script>

<template>
 <h2 class="section-title">
  <slot></slot>
 </h2>
</template>

<style lang="scss">
.section-title {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-top: 0;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e67e22;
  padding-bottom: 0.5rem;
}
</style>