<script setup lang="ts">
import { defineProps, PropType, defineEmits, ref, reactive } from 'vue';
import FormWrapper from '@/components/ui/form/FormWrapper.vue';
import FormInput from '@/components/ui/form/inputs/FormInput.vue';
import FormActions from '@/components/ui/form/inputs/FormActions.vue';
import JsonDisplay from '@/components/common/JsonDisplay.vue';
import { FetchDataFunction, placeholderResultJSON, QueryField } from '../sourcesManager.types';

const props = defineProps({
  sourceName: {
    type: String,
    requireed: true
  },
  /** Fields by which data will be fetched with fetchData method */
  queryFields: {
    type: Array as PropType<QueryField[]>,
    required: true
  },
  infoTag: {
    type: Object as PropType<{ email: string } | null>,
    required: false,
    default: null
  },
  /** Method to fetch JSON data on submit */
  fetchData: {
    type: Function as PropType<FetchDataFunction>,
    required: false,
    default: null
  }
});

const emit = defineEmits(['submit', 'reset', 'data-loaded']);

/** Reactive values that store user's form input */
const formValues = reactive<Record<string, any>>({});
// Initialize form values with empty values corresponding to number of inputs
props.queryFields.forEach(field => {
  formValues[field.id] = undefined;
});

const errorMessage = ref<string | undefined>(undefined);
const resultData = ref<unknown | null>(null);

const submitForm = async () => {
  try {
    errorMessage.value = undefined;
    
    // If a fetchData function is provided, use it to get data
    if (props.fetchData) {
      resultData.value = await props.fetchData(formValues);
    } else {
      // Default demo data if no fetchData function is provided
      resultData.value = placeholderResultJSON;
    }
    
    // Emit the submit event with form values and results
    emit('submit', { values: formValues, results: resultData.value });
    emit('data-loaded', resultData.value);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred';
  }
};

const resetForm = () => {
  // Reset all form values
  Object.keys(formValues).forEach(key => {
    formValues[key] = undefined;
  });
  
  resultData.value = null;
  errorMessage.value = undefined;
  
  emit('reset');
}
</script>

<template>
 <div class="source-tab">
  <div class="source-tab-header">
    <h3 class="tab-title">Book Source: {{ props.sourceName }}</h3>
  </div>
  <form @submit.prevent="submitForm">
    <FormWrapper title="">
      <!-- Dynamically render form fields based on props -->
      <template v-for="field in props.queryFields" :key="field.id">
        <FormInput
          :id="field.id"
          v-model.string="formValues[field.id]"
          :label="field.label"
          :required="field.required"
          :placeholder="field.placeholder"
          :type="field.type || 'text'"
        />
      </template>
    </FormWrapper>

    <!--Form Actions-->
    <FormActions :onReset="resetForm"/>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </form>

  <div v-if="resultData" class="book-search__results">
    <JsonDisplay :jsonData="resultData"/>
  </div>

  <p 
    v-if="props.infoTag" 
    class="info-text"
  >
    Have problems with source? Report to <a :href="`mailto:${props.infoTag.email}`">{{ props.infoTag.email }}</a>
  </p>
 </div>
</template>

<style scoped lang="scss">
.source-tab {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arial', sans-serif;

  .source-tab-header {
    margin-bottom: 2rem;
    text-align: center;

    h3 {
      font-size: 1.8rem;
      color: #333;
      margin: 0;
    }
  }

  .error-message {
    color: #e74c3c;
    margin-top: 0.5rem;
  }

  form {
    margin-bottom: 2rem;
  }

  .info-text {
    margin: 0;
    
    a {
      color: #3498db;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>