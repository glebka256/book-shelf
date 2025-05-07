<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// Define Props
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  required: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  min: {
    type: [Number, String],
    default: undefined
  },
  max: {
    type: [Number, String],
    default: undefined
  },
  step: {
    type: [Number, String],
    default: undefined
  },
  error: {
    type: String,
    default: ''
  }
});

// Define Emits
const emit = defineEmits(['update:modelValue']);

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (props.type === 'number') {
    // For number inputs, convert to number or use null if empty
    const value = target.value === '' ? null : Number(target.value);
    emit('update:modelValue', value);
  } else {
    emit('update:modelValue', target.value);
  }
};
</script>

<template>
  <div class="form-group">
    <label :for="props.id">{{ props.label }}</label>
    <input 
      :id="props.id" 
      :value="props.modelValue" 
      @input="updateValue"
      :type="type" 
      :required="required"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :step="step"
      :class="{ 'has-error': error }"
    />
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/form.module.scss";
</style>