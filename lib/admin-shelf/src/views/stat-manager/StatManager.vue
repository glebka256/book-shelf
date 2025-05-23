<script setup lang="ts">
import { onMounted, ref } from "vue";
import { formStats, Stats } from "./statManager";
import StatCard from "@/components/common/buttons/StatCard.vue";
import TextLoader from '@/../../component-lib/src/components/loaders/TextLoader.vue';

const loading      = ref<boolean>(false);
const errorMessage = ref<string | null>(null);

const stats = ref<Stats | null>(null);

const loadStats = async () => {
  loading.value = true;
  errorMessage.value = null;

  try {
    stats.value = await formStats();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred'; 
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadStats();
});
</script>

<template>
 <div class="stat-manager">
  <div class="books-stats" v-if="stats">
    <h2>Book Stats</h2>
    <div class="total-stats">
      <StatCard label="Total Books" :value="stats.total.books" />
      <StatCard label="Total Subjects" :value="stats.total.subjects" />
      <StatCard label="Total Authors" :value="stats.total.authors" />
    </div>
  </div>

  <div class="users-stats">
    <h2>User Stats</h2>
  </div>

  <div v-if="loading">
    <TextLoader loaderText="Loading books statistics..." />
  </div>
 </div>
</template>

<style scoped lang="scss">
@import '@/styles/manager.scss';

.stat-manager {
  @extend %manager-base;
}
</style>