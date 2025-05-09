<script setup lang="ts">
import { defineProps, ref } from 'vue';
import FormWrapper from '@/components/ui/form/FormWrapper.vue';
import FormInput from '@/components/ui/form/inputs/FormInput.vue';
import FormActions from '@/components/ui/form/inputs/FormActions.vue';

const props = defineProps({
  sourceName: {
    type: String,
    requireed: true
  },
  searchPlaceholder: {
    type: String,
    required: false,
    default: "Enter book title, author, or ISBN"
  }
});

const query = ref<string | undefined>(undefined);

const submitForm = () => {
  console.log("Form submited");
}

const resetForm = () => {
  console.log("Form reset");
}
</script>

<template>
 <div class="source-tab">
  <div class="source-tab-header">
    <h3 class="tab-title">Book Source: {{ props.sourceName }}</h3>
  </div>
  <form @submit.prevent="submitForm">
    <FormWrapper title="">
      <FormInput 
        id="query"
        v-model.string="query"
        label="Query *"
        required
        :placeholder="searchPlaceholder"
      />
    </FormWrapper>

    <!--Form Actions-->
    <FormActions :onReset="resetForm"/>
  </form>
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
}
</style>