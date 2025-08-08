<script setup lang="ts">
import { defineProps, PropType, ref } from "vue";

export interface LandingFeature {
  id: number,
  title: string,
  description: string
}

const props = defineProps({
  features: {
    type: Array as PropType<LandingFeature[]>,
    required: true
  }
});

const activeTooltip = ref<number | null>(null);

const showTooltip = (tooltipID: number): void => {
  activeTooltip.value = tooltipID;
}

const hideTooltip = (): void => {
  activeTooltip.value = null;
}
</script>

<template>
  <div class="features-section">
    <div 
      class="feature-item" 
      v-for="feature in props.features" 
      :key="feature.id"
    >
      <div 
        class="feature-bullet"
        @mouseenter="showTooltip(feature.id)"
        @mouseleave="hideTooltip"
      >
        <div class="bullet-point"></div>
        <span class="feature-title">{{ feature.title }}</span>
      </div>

      <!-- Tooltip is now OUTSIDE of .feature-bullet -->
      <div 
        v-if="activeTooltip === feature.id" 
        class="tooltip tooltip-visible"
      >
        {{ feature.description }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.features-section {
  margin-bottom: 2rem;
}

.feature-item {
  margin-bottom: 1rem;
  position: relative; /* Positioning context for tooltip */

  .feature-bullet {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 12px;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(5px); /* this no longer traps tooltip */
    }

    .bullet-point {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      margin-right: 1rem;
      flex-shrink: 0;
      animation: pulse 2s infinite;
    }

    .feature-title {
      font-weight: 600;
      color: rgba(16, 18, 61, 0.9);
      font-size: 1.1rem;
    }
  }

  .tooltip {
    position: absolute;
    top: 100%;
    left: 2rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    padding: 0.75rem 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    color: rgba(16, 18, 61, 0.8);
    font-size: 0.9rem;
    max-width: 280px;
    z-index: 9999;
    opacity: 0;
    transform: translateY(-10px);
    animation: tooltipSlideIn 0.2s ease-out forwards;

    &.tooltip-visible {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

@keyframes tooltipSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>