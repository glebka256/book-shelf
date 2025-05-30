<script setup lang="ts">
import { defineProps, PropType, computed } from 'vue';

export interface SystemStat {
  icon: string,
  label: string,
  value: string
}

const props = defineProps({
  stats: Array as PropType<SystemStat[]>,
  loading: {
    type: Boolean,
    default: false
  }
});

const isLoading = computed(() => props.loading || props.stats?.some(stat => stat.value === "..."));
</script>

<template>
  <div class="stats-grid" :class="{ 'loading': isLoading }">
    <div
      v-for="(stat, index) in props.stats"
      :key="stat.label"
      class="stat-card"
      :style="{ '--animation-delay': `${index * 0.1}s` }"
    >
      <div class="stat-icon-container">
        <div class="stat-icon">{{ stat.icon }}</div>
        <div class="stat-icon-bg"></div>
      </div>
      <div class="stat-content">
        <h3 class="stat-number" :class="{ 'loading-text': isLoading }">
          {{ stat.value }}
        </h3>
        <p class="stat-label">{{ stat.label }}</p>
      </div>
      <div class="stat-trend">
        <div class="trend-indicator"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";
@import "@/styles/home_grid.module.scss";

.stats-grid {
  @include stats-grid-layout;
  
  .stat-card {
    @extend %card-base;
    @include card-padding-comfortable;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    animation: slideInUp 0.6s ease-out both;
    animation-delay: var(--animation-delay);
    
    .stat-icon-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      .stat-icon {
        @include icon-base(3rem);
        position: relative;
        z-index: 2;
      }
      
      .stat-icon-bg {
        position: absolute;
        width: 60px;
        height: 60px;
        background: linear-gradient(
          135deg,
          rgba(103, 126, 234, 0.1),
          rgba(118, 75, 162, 0.05)
        );
        border-radius: 50%;
        animation: pulseGlow 4s ease-in-out infinite;
        animation-delay: var(--animation-delay);
      }
    }
    
    .stat-content {
      flex-grow: 1;
      min-width: 0; // Prevents flex item from overflowing
      
      .stat-number {
        @include card-title;
        font-size: 2.2rem;
        margin-bottom: 0.25rem;
        
        &.loading-text {
          background: linear-gradient(90deg, 
            rgba(255, 255, 255, 0.1) 25%, 
            rgba(255, 255, 255, 0.3) 50%, 
            rgba(255, 255, 255, 0.1) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 6px;
          color: transparent;
          -webkit-text-fill-color: transparent;
          background-clip: padding-box;
        }
        
        @media (max-width: $small-width) {
          font-size: 1.8rem;
        }
      }
      
      .stat-label {
        @include card-subtitle;
        font-size: 0.95rem;
        opacity: 0.7;
      }
    }
    
    .stat-trend {
      position: relative;
      width: 4px;
      height: 60px;
      margin-left: auto;
      
      .trend-indicator {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          to bottom,
          $initial-gradient-bg-color,
          $transition-gradient-bg-color
        );
        border-radius: 2px;
        opacity: 0.6;
        transform: scaleY(0);
        transform-origin: bottom;
        animation: trendGrow 1s ease-out 0.8s both;
        animation-delay: calc(var(--animation-delay) + 0.8s);
      }
    }
    
    // Enhanced hover effects
    &:hover {
      .stat-icon {
        animation-duration: 3s;
        transform: scale(1.1);
      }
      
      .stat-icon-bg {
        transform: scale(1.2);
        opacity: 0.8;
      }
      
      .trend-indicator {
        opacity: 1;
        transform: scaleY(1) scaleX(1.5);
      }
    }
  }
  
  // Loading state styling
  &.loading {
    .stat-card {
      @extend %shimmer-effect;
    }
  }
}

// Keyframe animations
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes trendGrow {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

@keyframes pulseGlow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>