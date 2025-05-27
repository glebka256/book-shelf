<script setup lang="ts">
import { onMounted, ref } from "vue";
import { formStats, Stats } from "./statManager";
import { PublicationFrequency } from "./stat.api";
import type { ChartFrequency, ChartConfig } from "@/component-lib/charts/FrequencyChart.vue";
import StatCard from "@/component-lib/StatCard.vue";
import TextLoader from "@/component-lib/loaders/TextLoader.vue";
import DataTable from "@/component-lib/layout/DataTable.vue";
import ToolTip from "@/component-lib/common/ToolTip.vue";
import FrequencyChart from "@/component-lib/charts/FrequencyChart.vue";

const loading      = ref<boolean>(false);
const errorMessage = ref<string | null>(null);

const stats = ref<Stats | null>(null);

const loadStats = async () => {
  loading.value = true;
  errorMessage.value = null;

  try {
    stats.value = await formStats();
    formActivityDataCell();
    formPublicationData(stats.value.publicationTimeline);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred'; 
  } finally {
    loading.value = false;
  }
}

interface ActivityDataCell {
  param: string,
  total: number,
  avg: number,
  max: number
}

const activityTableColumns = ref([
  {
    key: 'param',
    label: '',
    headerClass: 'header-param'
  },
  {
    key: 'total',
    label: 'Total',
    headerClass: 'header-total',
    cellClass: 'text-center'
  },
  {
    key: 'avg',
    label: 'avg per user',
    headerClass: 'header-avg',
    cellClass: 'text-center'
  },
  {
    key: 'max',
    label: 'max per user',
    headerClass: 'header-max',
    cellClass: 'text-center'
  }
])
const activityTableData = ref<ActivityDataCell[] | null>(null);

const formActivityDataCell = (): void => {
  if (stats.value) {
    activityTableData.value = [
      {
        param: "Favorites",
        total: stats.value.activity.users.totalFavorites,
        avg: Number(stats.value.activity.users.avgFavoritesPerUser.toFixed(4)),
        max: stats.value.activity.users.maxFavorites,
      },
      {
        param: "Other Interactions",
        total: stats.value.activity.users.totalInteractions,
        avg: Number(stats.value.activity.users.avgInteractionsPerUser.toFixed(4)),
        max: stats.value.activity.users.maxInteractions,
      }
    ];
  }
}

const publicationChartData = ref<ChartFrequency[] | null>(null);

const formPublicationData = (data: PublicationFrequency[]): void => {
  publicationChartData.value = data.map(item => ({
    time: item.year,
    count: item.books
  }));
}

const publicationChartConfig: ChartConfig = {
  title: 'Publication Frequency Timeline',
  datasetLabel: 'Books Published',
  yAxisLabel: 'Number of Books',
  xAxisLabel: 'Year',
  color: 'rgb(99, 102, 241)',
  backgroundColor: 'rgba(99, 102, 241, 0.1)'
}

const tipText = {
  statCard: {
    totalSubjects: "Number of unique subject keywords in the database",
    totalInteractions: "Number of registered and stored user actions (like, buy, read, click, etc.)"
  },
  dataTable: {
    favorites: "How many unique books were added to favorites",
    interactions: "How many user interactions were made (like, buy, read, click, etc.)"
  }
}

onMounted(() => {
  void loadStats();
});
</script>

<template>
 <div class="stat-manager" v-if="stats">
  <div class="content-stats">
    <h2>Content Stats</h2>
    <div class="total-stats">
      <StatCard label="Total Books" :value="stats.total.books" />
      <StatCard label="Total Subjects" :value="stats.total.subjects" >
        <ToolTip 
          :text="tipText.statCard.totalSubjects"
          position="bottom"
          :dark="true"
        />
      </StatCard>
      <StatCard label="Total Authors" :value="stats.total.authors" />
    </div>
    <FrequencyChart v-if="publicationChartData" 
      :data="publicationChartData" 
      :config="publicationChartConfig"
      :maxWidth="1200"
    />
  </div>

  <div class="activity-stats" v-if="stats">
    <h2>Activity Stats</h2>
    <div class="total-stats">
      <StatCard label="Total Users" :value="stats.activity.users.totalUsers" />
      <StatCard 
        label="Total Interactions" 
        :value="stats.activity.users.totalFavorites + stats.activity.users.totalInteractions" 
      >
        <ToolTip 
          :text="tipText.statCard.totalInteractions"
          position="top"
          :dark="true"
        />
      </StatCard>
      <DataTable
        v-if="activityTableData"
        :data="activityTableData" 
        :columns="activityTableColumns"
        row-key="param"
      >
        <!-- Use custom rendering for param column to add ToolTip -->
        <template #param="{ item, value }">
          <span>
            {{ value }}
            <ToolTip
              v-if="item.param === 'Favorites'"
              :text="tipText.dataTable.favorites"
              position="top"
              :dark="true"
            />
            <ToolTip
              v-else-if="item.param === 'Other Interactions'"
              :text="tipText.dataTable.interactions"
              position="bottom"
              :dark="true"
            />
          </span>
        </template>
      </DataTable>
    </div>
  </div>
 </div>

  <div v-if="loading">
    <TextLoader loaderText="Loading books statistics..." />
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/manager.scss';

.stat-manager {
  @extend %manager-base;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  h2 {
    text-align: left;
    margin-left: 3rem;
  }
}

.total-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}
</style>