<script setup lang="ts">
import HomeHeader from './components/HomeHeader.vue';

</script>

<template>
  <div class="bg-wrapper">
    <div class="admin-home">
      <!-- Header Section -->
      <HomeHeader 
        title="Book Shelf Dashboard"
        subtitle="Manage and monitor Book Shelf library"
      />

      <!-- Main Content -->
      <main>
        <p>This is main content</p>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";
@import '@/styles/manager.scss';

.bg-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, $initial-gradient-bg-color 0%, $transition-gradient-bg-color 100%);
}

.admin-home {
  @extend %manager-base;
  color: $main-thick-font;
  font-family: $home-page-font;
}

main {
  max-width: $manager-content-mxwidth;
  margin: 0 auto;
  padding: 3rem 2rem;
}
</style>