<script setup lang="ts">
import AppBar from './components/AppBar.vue';
</script>

<template>
  <app-bar />
  <div class="main-content">
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.main-content {
  margin-left: 142px;
}

@media (max-width: 1084px) {
  .main-content {
    margin-left: 92px;
  }
}
</style>
