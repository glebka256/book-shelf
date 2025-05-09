<script setup lang="ts">
import { defineProps, PropType, ref } from 'vue';
import FormWrapper from '@/components/ui/form/FormWrapper.vue';
import FormInput from '@/components/ui/form/inputs/FormInput.vue';
import FormActions from '@/components/ui/form/inputs/FormActions.vue';
import JsonDisplay from '@/components/common/JsonDisplay.vue';

const props = defineProps({
  sourceName: {
    type: String,
    requireed: true
  },
  searchPlaceholder: {
    type: String,
    required: false,
    default: "Enter book title, author, or ISBN"
  },
  infoTag: {
    type: Object as PropType<{ email: string } | null>,
    required: false,
    default: null
  }
});

const query = ref<string | undefined>(undefined);
const errorMessage = ref<string | undefined>(undefined);

const bookData = ref<unknown | null>(null);

const submitForm = () => {
  console.log("Form submited");
  bookData.value =   
  [
    {
      "bookId": "42844155",
      "title": "Harry Potter and the Sorcerer’s Stone (Harry Potter, #1)J.K. RowlingOlly Moss",
      "imageUrl": "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1598823299i/42844155._SX50_.jpg",
      "bookUrl": "/book/show/42844155-harry-potter-and-the-sorcerer-s-stone?from_search=true&from_srp=true&qid=dttqYffwRH&rank=1",
      "author": "J.K. Rowling, Olly Moss",
      "rank": 1,
      "rating": 4.47,
      "publishedYear": "1997"
    }
  ];
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

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </form>

  <div v-if="bookData" class="book-search__results">
    <JsonDisplay :jsonData="bookData"/>
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