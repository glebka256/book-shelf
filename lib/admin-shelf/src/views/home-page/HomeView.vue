<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import HomeHeader from './components/HomeHeader.vue';
import SectionTitle from './components/SectionTitle.vue';
import StatGrid from './components/StatGrid.vue';
import type { SystemStat } from './components/StatGrid.vue';
import ActionsGrid from './components/ActionsGrid.vue';
import type { QuickAction } from './components/ActionsGrid.vue';

const overviewStats = ref<SystemStat[]>([
  { icon: '📖', label: "Total Books",  value: "4800"     },
  { icon: '👤', label: "Active Users", value: "20"       },
  { icon: '🗄️', label: "DB Size",      value: "141.9 MB" },
]);

const quickActions = ref<QuickAction[]>([
  {
    title: 'Authentication',
    descr: 'Authenticate or view personal profile info',
    route: '/profile',
    icon: '🔐',
    colorCode: '#ef4444'
  },
  {
    title: 'Content Management',
    descr: 'Edit books, add new content, manage metadata and more',
    route: '/storage-manager',
    icon: '📚',
    colorCode: '#3b82f6'
  },
  {
    title: 'Create Book',
    descr: 'Add new book to library',
    route: '/storage-manager',
    icon: '💾',
    colorCode: '#06b6d4'
  },
  {
    title: 'External Sources',
    descr: 'Access third-party public content and integrations',
    route: '/sources-manager',
    icon: '🌐',
    colorCode: '#8b5cf6'
  },
  {
    title: 'User Management',
    descr: 'View registered profiles, user activity',
    route: '/users-manager',
    icon: '👥',
    colorCode: '#10b981'
  },
  {
    title: 'System Statistics',
    descr: 'Storage stats, content overview, user activity reports',
    route: '/stat-manager',
    icon: '📊',
    colorCode: '#f59e0b'
  },
]);

const router = useRouter();

const navigateToRoute = (route: string): void => {
  router.push(route);
}
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

        <section class="actions-section">
          <SectionTitle>Quick Actions</SectionTitle>
          <ActionsGrid 
            :quickActions="quickActions"
            @router:navigate="navigateToRoute"
          />
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

  .actions-section {
    margin-bottom: 4rem;
  }
}
</style>