<script setup lang="ts">
import { defineProps, PropType, defineEmits } from 'vue';

defineProps({
  labelText: {
    type: String,
    required: true
  },
  options: {
    type: Array as PropType<string[]>,
    required: true
  },
  placeholder: {
    type: String,
    required: false,
    default: "Select option"
  }
});

const emit = defineEmits(['select-option']);

function handleSelection(event: Event) {
  const target = event.target as HTMLSelectElement;
  if (target.value) {
    emit('select-option', target.value);
  }
}
</script>

<template>
  <div class="input-selector">
    <label for="selector" class="selector-label">{{ labelText }}</label>
    <select id="selector" name="selector" class="selector" @change="handleSelection">
      <option class="placeholder">{{ placeholder }}</option>
      <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
    </select>
  </div>
</template>

<style scoped lang="scss">
.input-selector {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.selector-label {
  font-size: 1.1rem;
  font-weight: bold;
  color: #34495e;
}

.selector {
  appearance: none;
  padding: 8px 24px;
  font-size: 1rem;
  font-weight: 500;
  color: #2c3e50;
  background-color: #f5f6fa;
  border: 2px solid #dcdde1;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;

  option {
    &.placeholder {
      color: #b0b0b0;
    }
  }

  &:hover {
    border-color: #7175d1;
  }

  &:focus {
    outline: none;
    border-color: #5c60c0;
    box-shadow: 0 0 8px rgba(113, 117, 209, 0.5);
  }
}

.selector::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  border: solid transparent;
  border-width: 6px 6px 0;
  border-top-color: #34495e;
}
</style>