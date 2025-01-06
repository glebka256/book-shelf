<script setup lang="ts">
import { defineProps, PropType, defineEmits, reactive } from 'vue';
import { FormField } from '@/types/Auth';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  fields: {
    type: Array as PropType<FormField[]>,
    required: true
  },
  submitText: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['submit']);

const formData = reactive<Record<string, string>>({});

props.fields.forEach((field) => {
  formData[field.name] = '';
});

function onSubmit() {
  emit('submit', formData);
}
</script>

<template>
 <div class="auth-form">
  <h2>{{ props.title }}</h2>
  <form @submit.prevent="onSubmit">
    <div v-for="field in props.fields" :key="field.name" class="form-group">
      <label :for="field.name">{{ field.label }}</label>
      <input 
        :type="field.type"
        :id="field.name"
        v-model="formData[field.name]"
        :placeholder="field.placeholder"
        required
      />
    </div>
    <button type="submit">{{ props.submitText }}</button>
    <slot></slot>
  </form>
 </div>
</template>

<style scoped lang="scss">
.auth-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;

    label {
      font-size: 1rem;
      flex: 1;
      text-align: right;
    }

    input {
      flex: 2;
      padding: 0.75rem;
      font-size: 0.875rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      transition: border-color 0.2s ease;

      &:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
      }
    }
  }

  button {
    padding: 0.75rem;
    font-size: 1rem;
    color: #fff;
    background: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: #0056b3;
    }

    &:active {
      background: #004085;
    }
  }

  ::v-deep(router-link) {
    display: block;
    margin-top: 1rem;
    text-align: center;
    font-size: 0.875rem;
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
