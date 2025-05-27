<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { UserStats } from '@/types/User.types';
import { getUserStats } from './usersManager';
import StatCard from '@/components/common/buttons/StatCard.vue';
import IconButton from '@/component-lib/buttons/IconButton.vue';
import DataTable from '@/component-lib/layout/DataTable.vue';
import ToolTip from '@/component-lib/common/ToolTip.vue';
import LoadSpinner from '@/component-lib/loaders/LoadSpinner.vue';
import PaginationBox from '@/components/ui/PaginationBox.vue';

const loading = ref<boolean>(false);

const page = ref<number>(1);
const totalPages = ref<number>(1);
const limit = 50;

const errorMessage = ref<string | null>(null);
const userStats = ref<UserStats | null>(null);

const columns = ref([
  {
    key: 'username',
    label: 'Username',
    headerClass: 'header-username'
  },
  {
    key: 'email',
    label: 'Email Address',
    headerClass: 'header-email'
  },
  {
    key: 'favoriteCount',
    label: 'Favorites',
    headerClass: 'header-center',
    cellClass: 'text-center'
  },
  {
    key: 'interactionCount',
    label: 'Interactions',
    headerClass: 'header-center',
    cellClass: 'text-center'
  }
])

const tipText = {
  favorites: "A number of books user added as favorite",
  interactions: "Number of interactions user done on the website (liked, cliked cover, bought, etc)"
}

const paginatedUsers = computed(() => {
  if (!userStats.value) return [];
  const start = (page.value - 1) * limit;
  return userStats.value.users.slice(start, start + limit);
});

watch(userStats, () => {
  if (userStats.value) {
    totalPages.value = Math.ceil(userStats.value.users.length / limit);
    if (page.value > totalPages.value) page.value = totalPages.value;
  }
});

watch(page, () => {
  // Ensure page stays in bounds
  if (page.value < 1) page.value = 1;
  if (page.value > totalPages.value) page.value = totalPages.value;
});

const fetchUserStats = async (): Promise<void> => {
  loading.value = true;

  try {
    userStats.value = null;
    userStats.value = await getUserStats();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred';
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  fetchUserStats();
});
</script>

<template>
  <div class="users-manager">
    <div v-if="userStats" class="stats-summary">
      <StatCard label="Total Interactions" :value="userStats.totalInteraction" />
      <StatCard label="Total Favorites" :value="userStats.totalFavorites" />
      <IconButton iconType="reset" @click="fetchUserStats"/>
    </div>

    <DataTable v-if="userStats" 
      :data="paginatedUsers" 
      :columns="columns"
      row-key="username"
    >
      <!-- Custom tooltip for favorites header -->
      <template #header-favoriteCount>
        <span>Favorites</span><ToolTip :text="tipText.favorites" position="top" :dark="true" />
      </template>

      <!-- Custom tooltip for interactions header -->
      <template #header-interactionCount>
        <span>Interactions</span><ToolTip :text="tipText.interactions" position="top" :dark="true" />
      </template>

      <!-- Custom email slot with mailto link -->
      <template #email="{ value }">
        <a :href="`mailto:${value}`" class="email-link">{{ value }}</a>
      </template>
      
      <!-- Custom icon for favorites count -->
      <template #favoriteCount="{ value }">
        <span class="favorite-badge">
          ⭐ {{ value }}
        </span>
      </template>
    </DataTable>

    <PaginationBox 
      :currentPage="page"
      :totalPages="totalPages"
    />

    <div v-if="loading">
      <LoadSpinner />
    </div>

    <div 
      v-else-if="userStats && userStats.users.length === 0" 
      class="empty-state"
    >
      <p>No users found</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/manager.scss';

.users-manager {
  @extend %manager-base;

  .stats-summary {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;
  }
  
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #666;
    
    p {
      margin: 0;
    }
  }
}
</style>