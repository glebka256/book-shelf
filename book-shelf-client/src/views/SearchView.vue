<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const searchQuery = route.query.q || "";
console.log(searchQuery);
</script>

<template>
 <div class="search-view">
  <h1>Search Results</h1>
 </div>
</template>

<style scoped lang="scss">

</style>