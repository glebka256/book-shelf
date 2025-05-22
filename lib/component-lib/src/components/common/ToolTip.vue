<script setup lang="ts">
import { withDefaults, defineProps, ref, computed, nextTick, onUnmounted, type Ref } from 'vue'

// Types
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

interface Props {
  text: string
  position?: TooltipPosition
  delay?: number
  dark?: boolean
  maxWidth?: string
}

// Props
const props = withDefaults(defineProps<Props>(), {
  position: 'top',
  delay: 200,
  dark: false,
  maxWidth: '200px'
})

// Reactive state
const isVisible: Ref<boolean> = ref(false)
const helperRef: Ref<HTMLElement | null> = ref(null)
const tooltipRef: Ref<HTMLElement | null> = ref(null)
let showTimeout: ReturnType<typeof setTimeout> | null = null
let hideTimeout: ReturnType<typeof setTimeout> | null = null

// Computed properties
const tooltipId = computed((): string => `tooltip-${Math.random().toString(36).substr(2, 9)}`)

// Methods
const showTooltip = async (): Promise<void> => {
  if (hideTimeout) clearTimeout(hideTimeout)
  
  showTimeout = setTimeout(async () => {
    isVisible.value = true
    await nextTick()
    positionTooltip()
  }, props.delay)
}

const hideTooltip = (): void => {
  if (showTimeout) clearTimeout(showTimeout)
  
  hideTimeout = setTimeout(() => {
    isVisible.value = false
  }, props.delay)
}

const positionTooltip = (): void => {
  if (!tooltipRef.value || !helperRef.value) return

  const tooltip = tooltipRef.value as HTMLElement
  const trigger = helperRef.value as HTMLElement
  const triggerRect: DOMRect = trigger.getBoundingClientRect()
  const tooltipRect: DOMRect = tooltip.getBoundingClientRect()
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  // Reset positioning
  tooltip.style.top = ''
  tooltip.style.left = ''
  tooltip.style.transform = ''
  tooltip.style.maxWidth = props.maxWidth

  let top: number, left: number

  switch (props.position) {
    case 'top':
      top = triggerRect.top - tooltipRect.height - 8
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      break
    case 'bottom':
      top = triggerRect.bottom + 8
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      break
    case 'left':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.left - tooltipRect.width - 8
      break
    case 'right':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.right + 8
      break
    default:
      top = triggerRect.top - tooltipRect.height - 8
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
  }

  // Viewport boundary checks
  if (left < 8) left = 8
  if (left + tooltipRect.width > viewport.width - 8) {
    left = viewport.width - tooltipRect.width - 8
  }
  if (top < 8) top = 8
  if (top + tooltipRect.height > viewport.height - 8) {
    top = viewport.height - tooltipRect.height - 8
  }

  tooltip.style.top = `${top}px`
  tooltip.style.left = `${left}px`
}

// Cleanup timeouts
onUnmounted(() => {
  if (showTimeout) clearTimeout(showTimeout)
  if (hideTimeout) clearTimeout(hideTimeout)
})
</script>

<template>
  <div class="user-helper" ref="helperRef">
    <!-- Question mark trigger -->
    <button
      type="button"
      class="helper-trigger"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
      @focus="showTooltip"
      @blur="hideTooltip"
      :aria-describedby="tooltipId"
      aria-label="Help information"
    >
      ?
    </button>

    <!-- Tooltip -->
    <Transition name="tooltip">
      <div
        v-if="isVisible"
        :id="tooltipId"
        class="tooltip"
        :class="[`tooltip--${position}`, { 'tooltip--dark': dark }]"
        role="tooltip"
        ref="tooltipRef"
      >
        <div class="tooltip__content">
          {{ text }}
        </div>
        <div class="tooltip__arrow"></div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
$border-color: #d1d5db;
$border-color-hover: #9ca3af;
$bg-color: #f9fafb;
$bg-color-hover: #e5e7eb;
$text-color: #6b7280;
$text-color-hover: #374151;
$text-color-content: #374151;
$focus-color: rgba(59, 130, 246, 0.5);

$tooltip-bg: white;
$tooltip-border: #e5e7eb;
$tooltip-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

$dark-bg: #1f2937;
$dark-border: #374151;
$dark-text: #f9fafb;

$transition-duration: 0.2s;
$arrow-size: 8px;

.user-helper {
  position: relative;
  display: inline-block;
}

.helper-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid $border-color;
  background-color: $bg-color;
  color: $text-color;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all $transition-duration ease;
  outline: none;

  &:hover,
  &:focus {
    background-color: $bg-color-hover;
    border-color: $border-color-hover;
    color: $text-color-hover;
    transform: scale(1.1);
  }

  &:focus {
    box-shadow: 0 0 0 2px $focus-color;
  }
}

.tooltip {
  position: fixed;
  z-index: 1000;
  padding: 0;
  pointer-events: none;

  &__content {
    background-color: $tooltip-bg;
    border: 1px solid $tooltip-border;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 13px;
    line-height: 1.4;
    color: $text-color-content;
    box-shadow: $tooltip-shadow;
    word-wrap: break-word;
  }

  &__arrow {
    position: absolute;
    width: $arrow-size;
    height: $arrow-size;
    background-color: $tooltip-bg;
    border: 1px solid $tooltip-border;
    transform: rotate(45deg);
  }

  // Dark theme
  &--dark {
    .tooltip__content {
      background-color: $dark-bg;
      border-color: $dark-border;
      color: $dark-text;
    }

    .tooltip__arrow {
      background-color: $dark-bg;
      border-color: $dark-border;
    }
  }

  // Arrow positioning based on tooltip position
  &--top .tooltip__arrow {
    bottom: -5px;
    left: 50%;
    margin-left: -($arrow-size / 2);
    border-top: none;
    border-left: none;
  }

  &--bottom .tooltip__arrow {
    top: -5px;
    left: 50%;
    margin-left: -($arrow-size / 2);
    border-bottom: none;
    border-right: none;
  }

  &--left .tooltip__arrow {
    right: -5px;
    top: 50%;
    margin-top: -($arrow-size / 2);
    border-left: none;
    border-bottom: none;
  }

  &--right .tooltip__arrow {
    left: -5px;
    top: 50%;
    margin-top: -($arrow-size / 2);
    border-right: none;
    border-top: none;
  }
}

// Transition animations
.tooltip-enter-active,
.tooltip-leave-active {
  transition: all $transition-duration ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.tooltip-enter-to,
.tooltip-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>