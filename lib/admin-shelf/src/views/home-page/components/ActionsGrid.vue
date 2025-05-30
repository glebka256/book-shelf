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
      v-for="(action, index) in props.quickActions"
      :key="action.route"
      class="action-card"
      @click="navigateToRoute(action.route)"
      :style="{ 
        '--accent-color': action.colorCode,
        '--animation-delay': `${index * 0.1}s`
      }"
    >
      <!-- Accent border animation -->
      <div class="accent-border"></div>
      
      <!-- Icon background glow -->
      <div class="icon-glow" :style="{ background: `radial-gradient(circle, ${action.colorCode}20, transparent)` }"></div>
      
      <div class="action-header">
        <div class="action-icon-container">
          <span class="action-icon">{{ action.icon }}</span>
          <div class="icon-backdrop"></div>
        </div>
        <h3 class="action-title">{{ action.title }}</h3>
      </div>
      
      <p class="action-description">{{ action.descr }}</p>
      
      <div class="action-footer">
        <div class="action-cta">
          <span class="cta-text">Explore</span>
          <div class="action-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
      
      <!-- Decorative elements -->
      <div class="decorative-dots">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";
@import "@/styles/home_grid.module.scss";

.actions-grid {
  @include actions-grid-layout;
  
  .action-card {
    @extend %card-base;
    @include card-padding-comfortable;
    @include interactive-element;
    position: relative;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    animation: slideInScale 0.6s ease-out both;
    animation-delay: var(--animation-delay);
    
    // Animated accent border
    .accent-border {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(
        90deg,
        var(--accent-color),
        rgba(255, 255, 255, 0.3),
        var(--accent-color)
      );
      background-size: 200% 100%;
      border-radius: 20px 20px 0 0;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      animation: gradientSlide 3s ease-in-out infinite;
    }
    
    // Icon background glow
    .icon-glow {
      position: absolute;
      top: 1.5rem;
      left: 1.5rem;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .action-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
      
      .action-icon-container {
        position: relative;
        flex-shrink: 0;
        
        .action-icon {
          @include icon-base(2.5rem);
          position: relative;
          z-index: 2;
          transition: transform 0.3s ease;
        }
        
        .icon-backdrop {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 50px;
          height: 50px;
          background: var(--accent-color);
          opacity: 0.1;
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      }
      
      .action-title {
        @include card-title;
        font-size: 1.4rem;
        flex-grow: 1;
        line-height: 1.3;
        
        @media (max-width: $small-width) {
          font-size: 1.25rem;
        }
      }
    }
    
    .action-description {
      @include card-subtitle;
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: auto;
      opacity: 0.8;
    }
    
    .action-footer {
      margin-top: 1.5rem;
      
      .action-cta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        .cta-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--accent-color);
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }
        
        .action-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: var(--accent-color);
          color: white;
          border-radius: 50%;
          opacity: 0.8;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          
          svg {
            transition: transform 0.3s ease;
          }
        }
      }
    }
    
    // Decorative dots
    .decorative-dots {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      display: flex;
      gap: 4px;
      
      .dot {
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        opacity: 0;
        animation: dotFade 2s ease-in-out infinite;
        
        &:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        &:nth-child(3) {
          animation-delay: 0.4s;
        }
      }
    }
    
    // Hover effects
    &:hover {
      .accent-border {
        transform: scaleX(1);
      }
      
      .icon-glow {
        opacity: 1;
      }
      
      .action-icon {
        transform: scale(1.1) rotate(5deg);
      }
      
      .icon-backdrop {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.2;
      }
      
      .action-arrow {
        transform: scale(1.1);
        opacity: 1;
        
        svg {
          transform: translateX(2px);
        }
      }
      
      .cta-text {
        opacity: 1;
      }
      
      .decorative-dots .dot {
        opacity: 1;
      }
    }
    
    // Focus state for accessibility
    &:focus-visible {
      .accent-border {
        transform: scaleX(1);
        height: 4px;
      }
    }
  }
}

// Keyframe animations
@keyframes slideInScale {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes gradientSlide {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes dotFade {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

// Responsive adjustments
@media (max-width: $small-width) {
  .actions-grid {
    .action-card {
      min-height: 160px;
      
      .decorative-dots {
        top: 1rem;
        right: 1rem;
      }
    }
  }
}
</style>