<script setup lang="ts">
import HomeHeader from './components/HomeHeader.vue';

</script>

<template>
  <div class="bg-wrapper">
    <div class="admin-home">
      <HomeHeader 
        title="Book Shelf Dashboard"
        subtitle="Manage and monitor Book Shelf library"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";
@import '@/styles/manager.scss';

.bg-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.admin-home {
  @extend %manager-base;
  color: #333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>