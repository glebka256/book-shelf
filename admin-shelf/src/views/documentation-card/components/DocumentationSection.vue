<script setup lang="ts">
// Static component
</script>

<template>
 <div class="documentation-section">
  <slot></slot>
 </div>
</template>

<style lang="scss">
.documentation-section {
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.4rem;
    color: #2c3e50;
    margin-bottom: 1rem;
  }
  
  ol, ul {
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }
  }
}
</style>