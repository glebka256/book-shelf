<script setup lang="ts">
import { onMounted, ref } from "vue";
import { formStats, formActivityDataCell, formPublicationData, formActivityData, formGenreDistributionData } from "./statManager";
import type { Stats, ActivityDataCell } from "./statManager";
import type { ChartFrequency, ChartConfig } from "@/component-lib/charts/frequencyChart.types";
import StatCard from "@/component-lib/StatCard.vue";
import TextLoader from "@/component-lib/loaders/TextLoader.vue";
import DataTable from "@/component-lib/layout/DataTable.vue";
import ToolTip from "@/component-lib/common/ToolTip.vue";
import FrequencyChart from "@/component-lib/charts/FrequencyChart.vue";
import PieChart from "@/component-lib/charts/PieChart.vue";
import { ChartDistribution, PieChartConfig } from "@/component-lib/charts/pieChart.types";
import { ChartColors, richLeftConfig } from "@/config/charts";

const loading      = ref<boolean>(false);
const errorMessage = ref<string | null>(null);

const stats = ref<Stats | null>(null);

const loadStats = async () => {
  loading.value = true;
  errorMessage.value = null;

  try {
    stats.value = await formStats();
    activityTableData.value = formActivityDataCell(stats.value.activity.users);
    genreDistributionChartData.value = formGenreDistributionData(stats.value.subjectDistribution);
    publicationChartData.value = formPublicationData(stats.value.publicationTimeline);
    activityChartData.value = formActivityData(stats.value.activity.weekly);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred'; 
  } finally {
    loading.value = false;
  }
}

const activityTableData = ref<ActivityDataCell[] | null>(null);
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

const genreDistributionChartData = ref<ChartDistribution[] | null>(null);
const genreDistributionChartConfig: PieChartConfig = richLeftConfig;

const publicationChartData = ref<ChartFrequency[] | null>(null);
const publicationChartConfig: ChartConfig = {
  title: 'Publication Frequency Timeline',
  datasetLabel: 'Books Published',
  yAxisLabel: 'Number of Books',
  xAxisLabel: 'Year',
  color: ChartColors.TealBright,
  backgroundColor: ChartColors.TealDark
}

const activityChartData = ref<ChartFrequency[] | null>(null);
const activityChartConfig: ChartConfig = {
  title: 'Weekly User Activity',
  datasetLabel: 'Interaction Count',
  yAxisLabel: 'Number of Interactions',
  xAxisLabel: 'Week',
  color: ChartColors.PurpleBright,
  backgroundColor: ChartColors.PurpleDark
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
  <div class="stat-manager-container">
    <div class="stat-manager" v-if="stats">
      <div class="content-stats">
        <h2>Content Statistics</h2>
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
        
        <div class="chart-container">
          <PieChart v-if="genreDistributionChartData" 
            title="Library Genre Distribution"
            :data="genreDistributionChartData"
            :config="genreDistributionChartConfig"
            :maxWidth="1200"
          />
        </div>
        
        <div class="chart-container">
          <FrequencyChart v-if="publicationChartData" 
            title="Publication Frequency Timeline"
            :data="publicationChartData" 
            :config="publicationChartConfig"
            :maxWidth="1200"
          />
        </div>
      </div>

      <div class="activity-stats" v-if="stats">
        <h2>Activity Statistics</h2>
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
        </div>
        
        <div class="table-container">
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
        
        <div class="chart-container">
          <FrequencyChart v-if="activityChartData" 
            title="Weekly User Activity"
            :data="activityChartData" 
            :config="activityChartConfig"
            :maxWidth="1200"
          />
        </div>
      </div>
    </div>

    <div class="loading" v-if="loading">
      <TextLoader loaderText="Loading book statistics..." />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/manager.scss';
@import "@/styles/variables.scss";

.stat-manager-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, $initial-gradient-bg-color 0%, $transition-gradient-bg-color 100%);
}

.stat-manager {
  @extend %manager-base;
  
  width: 70%;
  max-width: $manager-content-mxwidth;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: $widest-shadow;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;

  @media (max-width: $small-width) {
    width: 95%;
    padding: 2rem 1.5rem;
  }
}

.content-stats,
.activity-stats {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

h2 {
  text-align: center;
  color: $main-color;
  font-size: 2rem;
  font-weight: $med-thick;
  margin: 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, $initial-gradient-bg-color, $transition-gradient-bg-color);
    border-radius: 2px;
  }
}

.total-stats {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  width: 100%;
  
  @media (max-width: $small-width) {
    flex-direction: column;
    align-items: center;
  }
}

.chart-container,
.table-container {
  width: 100%;
  display: flex;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

@media (max-width: $med-width) {
  .stat-manager-container {
    padding: 1rem 0.5rem;
  }
  
  .stat-manager {
    width: 85%;
    padding: 2rem 1rem;
    gap: 2rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
}
</style>