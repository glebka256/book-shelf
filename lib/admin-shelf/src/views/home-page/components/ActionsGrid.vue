<script setup lang="ts">
import { defineProps, PropType, defineEmits } from 'vue';

export interface QuickAction {
  title: string,
  descr: string,
  route: string,
  icon: string,
  colorCode: string
}

const props = defineProps({
  quickActions: Array as PropType<QuickAction[]>
});

const emit = defineEmits(['router:navigate']);

const navigateToRoute = (route: string): void => {
  emit('router:navigate', route);  
}
</script>

<template>
  <div class="actions-grid">
    <div 
      v-for="action in props.quickActions" 
      :key="action.route"
      class="action-card"
      @click="navigateToRoute(action.route)"
      :style="{ '--accent-color': action.colorCode }"
    >
      <div class="action-header">
        <span class="action-icon">{{ action.icon }}</span>
        <h3 class="action-title">{{ action.title }}</h3>
      </div>
      <p class="action-description">{{ action.descr }}</p>
      <div class="action-arrow">→</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: $main-bgcolor;
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid $sec-thick-font;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    border-color: var(--accent-color);
    
    .action-arrow {
      transform: translateX(4px);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--accent-color);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: scaleX(1);
  }

  .action-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .action-icon {
    font-size: 2rem;
    opacity: 0.8;
  }

  .action-title {
    font-size: 1.3rem;
    font-weight: $med-thick;
    color: $main-thick-font;
    margin: 0;
  }

  .action-description {
    color: $sec-thick-font;
    line-height: 1.5;
    margin: 0 0 1rem 0;
  }

  .action-arrow {
    position: absolute;
    bottom: 1.5rem;
    right: 1.5rem;
    font-size: 1.2rem;
    color: var(--accent-color);
    font-weight: bold;
    transition: transform 0.3s ease;
  }
}
</style>