<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface Props {
  /** Optional type of button (submit, reset, button) */
  type?: 'button' | 'submit' | 'reset';
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Optional additional CSS classes */
  class?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();
</script>

<template>
  <button
    :type="props.type || 'button'"
    :disabled="props.disabled"
    :class="['button', props.class]"
    @click="(event: any) => emit('click', event)"
  >
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.button {
  padding: 0.625rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: $med-weight;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 6rem;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: $btn-bgcolor;
  color: $btn-color;
  border-color: $btn-bgcolor;
}

.btn-primary:hover:not(:disabled) {
  background-color: $btn-primary-bgcolor;
  border-color: $btn-primary-bgcolor;
}

.btn-secondary {
  background-color: $btn-secondary-bgcolor;
  color: $btn-secondary-color;
  border-color: $btn-secondary-bgcolor;
}

.btn-secondary:hover:not(:disabled) {
  background-color: $btn-secondary-bgcolor;
  border-color: $main-gray-bgcolor;
}

.btn-danger {
  background-color: $red-bright-color;
  color: $btn-color;
  border-color: $red-bright-color;
}

.btn-danger:hover:not(:disabled) {
  background-color: $red-dark-color;
  border-color: $red-dark-color;
}
</style>