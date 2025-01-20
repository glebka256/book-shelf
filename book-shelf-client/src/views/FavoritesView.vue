<script setup lang="ts">
import { useFavoritesStore } from '@/store';

const favoritesStore = useFavoritesStore();

function seeFavorites() {
  console.log("user's favorites: ", favoritesStore.getLocalFavorites());
}

</script>

<template>
 <div class="favorites-view">
  <h1>This is Favorites Page</h1>
  <button @click="seeFavorites">See Favorites</button>
 </div>
</template>

<style scoped lang="scss">

</style>