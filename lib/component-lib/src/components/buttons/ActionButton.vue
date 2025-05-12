<script setup lang="ts">
import { defineProps, defineEmits, useAttrs } from 'vue';

// TODO: Use slot instead of prop for 'text' field
// NOTO: Doing so makes currentRenderingInstance null which breaks rendering
interface Props {
  /** Optional type of button (submit, reset, button) */
  type?: 'button' | 'submit' | 'reset';
  /** Whether the button is disabled */
  disabled?: boolean;
/** Text displayed inside button. 
 * Slot is not used because currentRenderingInstance becomes null who knows why
*/
  text: string
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const attrs = useAttrs();
</script>

<template>
  <button
    :type="props.type || 'button'"
    :disabled="props.disabled"
    class="button"
    :class="attrs.class"
    @click="(event) => emit('click', event)"
  >
    {{ props.text }}    
  </button>
</template>

<style lang="scss">
.button {
  padding: 0.625rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
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
  background-color: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.btn-primary:hover:not(:disabled) {
  background-color: #4338ca;
  border-color: #4338ca;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #1f2937;
  border-color: #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
  border-color: #ef4444;
}

.btn-danger:hover:not(:disabled) {
  background-color: #dc2626;
  border-color: #dc2626;
}
</style>