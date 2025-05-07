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
.form-group {
  margin-bottom: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 0.9rem;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    background-color: white;
    transition: border-color 0.2s;
    
    &:focus {
      outline: none;
      border-color: #4a90e2;
      box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    }
    
    &.has-error {
      border-color: #dc3545;
      
      &:focus {
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
      }
    }
  }
  
  .error-message {
    color: #dc3545;
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }
}
</style>