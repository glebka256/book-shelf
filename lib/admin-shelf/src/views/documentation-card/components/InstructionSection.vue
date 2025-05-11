<script setup lang="ts">

</script>

<template>
 <div class="instruction-section">
  <slot></slot>
 </div>
</template>

<style lang="scss">
.instruction-section {
  background-color: #f0f7fb;
  border-left: 5px solid #3498db;
  line-height: 1.4rem;
  padding: 1rem;
  margin: 1.5rem 0;

  h3 {
    margin-top: 0;
  }

  ul {
    padding-left: 1.2rem;
    margin: 0;
    text-align: left;
  }

  li {
    margin-bottom: 0.5rem;
  }
}
</style>