<script setup lang="ts">
import NavigationView from './views/NavigationView.vue';
</script>

<template>
  <NavigationView />
  <div class="main-content">
    <router-view />
  </div>
</template>

<style lang="scss">
@import "@/styles/variables.scss";

html, body {
  height: 100%;
  margin: 0;
  background-color: $main-bgcolor;
}

#app {
  font-family: $main-font;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $main-color;
}

.main-content {
  margin-left: $appbar-width;
}

@media (max-width: $med-width) {
  .main-content {
    margin-left: $appbar-sml-width;
  }
}
</style>