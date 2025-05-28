<script setup lang="ts">
// No script
</script>

<template>
  <h2 class="section-title"><slot></slot></h2>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.section-title {
  font-size: 1.8rem;
  font-weight: $med-thick;
  color: $main-bgcolor;
  margin-bottom: 1.5rem;
  text-align: center;
}
</style>