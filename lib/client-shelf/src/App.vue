<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useFavoritesStore } from './store/favoritesStore';
import AppBar from '@/components/layout/AppBar.vue';
import auth from './config/auth';
import { sendInteractions } from './services/interactionService';

let intervalId: number;

onMounted(async () => {
  const favoritesStore = useFavoritesStore();
  favoritesStore.initialize();

  intervalId = setInterval(async () => {
    if (await auth.api.getLoginStatus()) {
      sendInteractions();
    }
  }, 30000);  // 30 sec
});

onUnmounted(() => {
  clearInterval(intervalId)
});
</script>

<template>
  <app-bar />
  <div class="main-content">
    <router-view />
  </div>
</template>

<style lang="scss">
html, body {
  height: 100%;
  margin: 0;
  background-color: #dddaf8;
}

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
