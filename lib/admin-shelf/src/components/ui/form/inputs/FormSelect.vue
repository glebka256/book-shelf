<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { defineProps, PropType, defineEmits } from 'vue';

// Define Interfaces
export interface SelectOption {
  value: string,
  label?: string
}

// Define Props
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  options: {
    type: Array as PropType<SelectOption[]>,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  }
});

// Define Emits
const emit = defineEmits(['update:modelValue']);

// Define Actions
const updateValue = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <select 
      :id="id" 
      :value="modelValue" 
      @input="updateValue"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option 
        v-for="option in options" 
        :key="option.value" 
        :value="option.value"
      >
        {{ option.label || option.value }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/form.module.scss";
@import "@/styles/variables.scss";

select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid $main-border-color;
  border-radius: 4px;
  font-size: 1rem;
  background-color: $main-bgcolor;
  transition: border-color 0.2s;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8.825L1.175 4 2.05 3.125 6 7.075 9.95 3.125 10.825 4z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
  
  &:focus {
    outline: none;
    border-color: $sec-btn-bgcolor;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }
}
</style>