<script setup lang="ts">
import HomeHeader from './components/HomeHeader.vue';
import SectionTitle from './components/SectionTitle.vue';
import StatGrid from './components/StatGrid.vue';
import type { SystemStat } from './components/StatGrid.vue';

const overviewStats: SystemStat[] = [
  { icon: '📖', label: "Total Books",  value: "4800"     },
  { icon: '👤', label: "Active Users", value: "20"       },
  { icon: '🗄️', label: "DB Size",      value: "141.9 MB" },
]
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
        <section class="stats-overview">
          <SectionTitle>System Overview</SectionTitle>
          <StatGrid :stats="overviewStats" />
        </section>
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

  .stats-overview {
    margin-bottom: 4rem;
  }
}
</style>