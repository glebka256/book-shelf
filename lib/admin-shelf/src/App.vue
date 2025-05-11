<script setup lang="ts">
import AppBar from "@/components/layout/AppBar.vue"; 
</script>

<template>
  <AppBar />
  <div class="main-content">
    <router-view />
  </div>
</template>

<style lang="scss">
html, body {
  height: 100%;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.main-content {
  margin-left: 238px; // Match with AppBar width
}

@media (max-width: 1084px) {
  .main-content {
    margin-left: 92px; // Match with AppBar media-width
  }
}
</style>