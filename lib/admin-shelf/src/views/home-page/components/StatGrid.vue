<script setup lang="ts">
import { defineProps, PropType } from 'vue';

export interface SystemStat {
    icon: string,
    label: string,
    value: string
}

const props = defineProps({
  stats: Array as PropType<SystemStat[]>,
});
</script>

<template>
  <div class="stats-grid">
    <div 
      v-for="stat in props.stats"
      :key="stat.label" 
      class="stat-card"
    >
      <div class="stat-icon">{{ stat.icon }}</div>
      <div class="stat-content">
        <h3 class="stat-number">{{ stat.value }}</h3>
        <p class="stat-label">{{ stat.label }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  .stat-card {
    background: $main-bgcolor;
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid $sec-thick-font;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: $widest-shadow;
    }

    .stat-icon {
      font-size: 2.5rem;
      opacity: 0.8;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: $main-thick-font;
      margin: 0;
    }

    .stat-label {
      font-size: 0.9rem;
      color: $sec-thick-font;
      margin: 0.25rem 0 0 0;
    }
  }
}
</style>