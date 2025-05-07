<script setup lang="ts">
import { reactive, defineEmits } from 'vue';
import FormWrapper from '@/components/ui/form/FormWrapper.vue';
import { BookFormDTO } from './bookForm.types';
import FormInput from '@/components/ui/form/inputs/FormInput.vue';
import FormSelect from '@/components/ui/form/inputs/FormSelect.vue';
import TagSelector from '@/components/ui/form/inputs/TagSelector.vue';
import FormActions from '@/components/ui/form/inputs/FormActions.vue';

// Define emit
const emit = defineEmits<{
  (e: 'submit', payload: BookFormDTO): void;
}>();

// Initial state
const initialBookState: BookFormDTO = {
  title: '',
  author: [],
  subject: [],
  publishedYear: new Date().getFullYear(),
  language: ['eng'],
  ebookAccess: false,
  meta: {
    isbn: '',
    idGutenberg: [],
    idGoodreads: [],
    idAnnasArchive: [],
    idAmazon: []
  },
  coverUrl: '',
  rating: 0,
  link: {
    size: {
      value: 0,
      metric: 'MB'
    },
    readUrl: '',
    downloadUrl: '',
    format: 'pdf',
    buyUrl: ''
  }
};

// Selector options
const options = {
  sizeMetric: [
    { value: 'KB' },
    { value: 'MB' },
    { value: 'GB' }
  ],
  fileFormat: [
    { value: 'pdf', label: 'PDF' },
    { value: 'epub', label: 'EPUB' },
    { value: 'mobi', label: 'MOBI' },
    { value: 'azw3', label: 'AZW3' },
    { value: 'txt', label: 'TXT' }
  ],
}

// Reactive state
const book = reactive<BookFormDTO>({ ...initialBookState });

// Form submission and reset
const submitForm = () => {
  if (!book.title.trim()) {
    alert('Please enter a book title');
    return;
  }
  if (book.author.length === 0) {
    alert('Please add at least one author');
    return;
  }
  emit('submit', { ...book });
};

const resetForm = () => {
  Object.assign(book, JSON.parse(JSON.stringify(initialBookState)));
};
</script>

<template>
  <div class="book-form">
    <h2>Add New Book</h2>
    <form @submit.prevent="submitForm">
      <!--Basic Information-->
      <FormWrapper title="Basic Information">
        <FormInput 
          id="title"
          v-model.string="book.title"
          label="Title *"
          required
          placeholder="Enter book title"
        />
        
        <TagSelector 
          id="author-selector"
          label="Authors *"
          v-model:tags="book.author"
          placeholder="Add author and press Enter"
        />

        <TagSelector 
          id="subject-selector"
          label="Subjects"
          v-model:tags="book.subject"
          placeholder="Add subject and press Enter"
        />
        
        <div class="form-grid">
          <FormInput
            id="publishedYear"
            v-model.number="book.publishedYear"
            label="Published Year"
            type="number"
            :min="1000"
            :max="2100"
            placeholder="Year published"
          />
          
          <TagSelector 
            id="language-selector"
            label="Languages"
            v-model:tags="book.language"
            placeholder="Add language code and press Enter"
          />
        </div>
        
        <div class="form-group">
          <div class="checkbox-group">
            <input 
              id="ebookAccess" 
              v-model="book.ebookAccess" 
              type="checkbox"
            />
            <label for="ebookAccess">Ebook Access Available</label>
          </div>
        </div>
      </FormWrapper>        
      
      <!--Meta Information-->
      <FormWrapper title="Meta Information">
        <FormInput 
          id="isbn"
          v-model.string="book.meta.isbn"
          label="ISBN"
          required
          placeholder="ISBN (e.g., 978-1234567890)"
        />
        
        <TagSelector 
          id="gutenberg-id-selector"
          label="ID Gutenberg"
          v-model:tags="book.meta.idGutenberg"
          placeholder="Add Gutenberg ID and press Enter"
        />
        
        <TagSelector 
          id="goodreads-id-selector"
          label="ID Goodreads"
          v-model:tags="book.meta.idGoodreads"
          placeholder="Add Goodreads ID and press Enter"
        />

        <TagSelector 
          id="annas-id-selector"
          label="ID Anna`s Archive"
          v-model:tags="book.meta.idAnnasArchive"
          placeholder="Add Anna's Archive ID and press Enter"
        />
        
        <TagSelector 
          id="amazon-id-selector"
          label="ID Amazon"
          v-model:tags="book.meta.idAmazon"
          placeholder="Add Amazon ID and press Enter"
        />
      </FormWrapper>
      
      <!--Media and Links-->
      <FormWrapper title="Media & Links">  
        <div class="form-group">
          <FormInput
            id="coverUrl"
            v-model="book.coverUrl"
            label="Cover URL"
            type="url"
            placeholder="URL to book cover image"
          />
          <div class="cover-preview" v-if="book.coverUrl">
            <img :src="book.coverUrl" alt="Book cover preview" />
          </div>
        </div>
        
        <FormInput
          id="rating"
          v-model.number="book.rating"
          label="Rating"
          type="number"
          :min="0"
          :max="5"
          step="0.1"
          placeholder="Book rating (0-5)"
        />
        
        <div class="form-group link-section">
          <h4>Link Information</h4>
          
          <FormInput
            id="size-value"
            v-model.number="book.link.size.value"
            label="Size Value"
            type="number"
            :min="0"
            step="0.1"
            placeholder="File size value"
          />

          <FormSelect 
            id="size-metric"
            label="Size Metric"
            v-model="book.link.size.metric"
            :options="options.sizeMetric"
          />

          <FormSelect 
            id="format"
            label="File Format"
            v-model="book.link.format"
            :options="options.fileFormat"
          />
          
          <FormInput
            id="readUrl"
            v-model="book.link.readUrl"
            label="Read URL"
            type="url"
            placeholder="URL to read the book online"
          />
          
          <FormInput
            id="downloadUrl"
            v-model="book.link.downloadUrl"
            label="Download URL"
            type="url"
            placeholder="URL to download the book"
          />
          
          <FormInput
            id="buyUrl"
            v-model="book.link.buyUrl"
            label="Buy URL"
            type="url"
            placeholder="URL to purchase the book"
          />
        </div>
      </FormWrapper>
      
      <!--Form Actions-->
      <FormActions :onReset="resetForm"/>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.book-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  
  h2 {
    margin-bottom: 1.5rem;
    color: #333;
    font-weight: 600;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .link-section {
    border-top: 1px solid #eee;
    padding-top: 1rem;
  }
  
  .checkbox-group {
    display: flex;
    align-items: center;
    
    input[type="checkbox"] {
      margin-right: 0.5rem;
      width: 1.2rem;
      height: 1.2rem;
      cursor: pointer;
    }
    
    label {
      margin-bottom: 0;
      cursor: pointer;
    }
  }
  
  // Cover preview styling
  .cover-preview {
    margin-top: 1rem;
    max-width: 200px;
    
    img {
      width: 100%;
      height: auto;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>