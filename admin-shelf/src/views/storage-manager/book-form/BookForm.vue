<script setup lang="ts">
import { reactive, ref, defineEmits, Ref } from 'vue';
import FormWrapper from '@/components/ui/form/FormWrapper.vue';
import { BookFormDTO } from './bookForm.types';
import FormInput from '@/components/ui/form/inputs/FormInput.vue';

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

// Reactive state
const book = reactive<BookFormDTO>({ ...initialBookState });

// Tag input refs
const newAuthor = ref('');
const newSubject = ref('');
const newLanguage = ref('');
const newGutenbergId = ref('');
const newGoodreadsId = ref('');
const newAnnasArchiveId = ref('');
const newAmazonId = ref('');

// Utility methods
const addItem = (list: string[], input: Ref<string>, transform?: (v: string) => string) => {
  const value = input.value.trim();
  if (value) {
    list.push(transform ? transform(value) : value);
    input.value = '';
  }
};

const removeItem = (list: string[], index: number) => {
  list.splice(index, 1);
};

// Specific add/remove handlers
const addAuthor = () => addItem(book.author, newAuthor);
const removeAuthor = (index: number) => removeItem(book.author, index);

const addSubject = () => addItem(book.subject, newSubject);
const removeSubject = (index: number) => removeItem(book.subject, index);

const addLanguage = () => addItem(book.language, newLanguage, v => v.toLowerCase());
const removeLanguage = (index: number) => removeItem(book.language, index);

const addGutenbergId = () => addItem(book.meta.idGutenberg, newGutenbergId);
const removeGutenbergId = (index: number) => removeItem(book.meta.idGutenberg, index);

const addGoodreadsId = () => addItem(book.meta.idGoodreads, newGoodreadsId);
const removeGoodreadsId = (index: number) => removeItem(book.meta.idGoodreads, index);

const addAnnasArchiveId = () => addItem(book.meta.idAnnasArchive, newAnnasArchiveId);
const removeAnnasArchiveId = (index: number) => removeItem(book.meta.idAnnasArchive, index);

const addAmazonId = () => addItem(book.meta.idAmazon, newAmazonId);
const removeAmazonId = (index: number) => removeItem(book.meta.idAmazon, index);

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
  newAuthor.value = '';
  newSubject.value = '';
  newLanguage.value = '';
  newGutenbergId.value = '';
  newGoodreadsId.value = '';
  newAnnasArchiveId.value = '';
  newAmazonId.value = '';
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
        
        <div class="form-group">
          <label>Authors *</label>
          <div class="tag-input">
            <div v-for="(author, index) in book.author" :key="`author-${index}`" class="tag">
              {{ author }}
              <button type="button" @click="removeAuthor(index)" class="tag-remove">&times;</button>
            </div>
            <input 
              v-model="newAuthor"
              @keydown.enter.prevent="addAuthor"
              type="text"
              placeholder="Add author and press Enter"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label>Subjects</label>
          <div class="tag-input">
            <div v-for="(subject, index) in book.subject" :key="`subject-${index}`" class="tag">
              {{ subject }}
              <button type="button" @click="removeSubject(index)" class="tag-remove">&times;</button>
            </div>
            <input 
              v-model="newSubject"
              @keydown.enter.prevent="addSubject"
              type="text"
              placeholder="Add subject and press Enter"
            />
          </div>
        </div>
        
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
          
          <div class="form-group">
            <label>Languages</label>
            <div class="tag-input">
              <div v-for="(lang, index) in book.language" :key="`lang-${index}`" class="tag">
                {{ lang }}
                <button type="button" @click="removeLanguage(index)" class="tag-remove">&times;</button>
              </div>
              <input 
                v-model="newLanguage"
                @keydown.enter.prevent="addLanguage"
                type="text"
                placeholder="Add language code and press Enter"
              />
            </div>
          </div>
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
        <div class="form-group">
          <label for="isbn">ISBN</label>
          <input 
            id="isbn" 
            v-model="book.meta.isbn" 
            type="text" 
            placeholder="ISBN (e.g., 978-1234567890)"
          />
        </div>
        
        <div class="form-group">
          <label>ID Gutenberg</label>
          <div class="tag-input">
            <div v-for="(id, index) in book.meta.idGutenberg" :key="`gutenberg-${index}`" class="tag">
              {{ id }}
              <button type="button" @click="removeGutenbergId(index)" class="tag-remove">&times;</button>
            </div>
            <input 
              v-model="newGutenbergId"
              @keydown.enter.prevent="addGutenbergId"
              type="text"
              placeholder="Add Gutenberg ID and press Enter"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label>ID Goodreads</label>
          <div class="tag-input">
            <div v-for="(id, index) in book.meta.idGoodreads" :key="`goodreads-${index}`" class="tag">
              {{ id }}
              <button type="button" @click="removeGoodreadsId(index)" class="tag-remove">&times;</button>
            </div>
            <input 
              v-model="newGoodreadsId"
              @keydown.enter.prevent="addGoodreadsId"
              type="text"
              placeholder="Add Goodreads ID and press Enter"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label>ID Anna's Archive</label>
          <div class="tag-input">
            <div v-for="(id, index) in book.meta.idAnnasArchive" :key="`annas-${index}`" class="tag">
              {{ id }}
              <button type="button" @click="removeAnnasArchiveId(index)" class="tag-remove">&times;</button>
            </div>
            <input 
              v-model="newAnnasArchiveId"
              @keydown.enter.prevent="addAnnasArchiveId"
              type="text"
              placeholder="Add Anna's Archive ID and press Enter"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label>ID Amazon</label>
          <div class="tag-input">
            <div v-for="(id, index) in book.meta.idAmazon" :key="`amazon-${index}`" class="tag">
              {{ id }}
              <button type="button" @click="removeAmazonId(index)" class="tag-remove">&times;</button>
            </div>
            <input 
              v-model="newAmazonId"
              @keydown.enter.prevent="addAmazonId"
              type="text"
              placeholder="Add Amazon ID and press Enter"
            />
          </div>
        </div>
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
            
          <div class="form-group">
            <label for="size-metric">Size Metric</label>
            <select id="size-metric" v-model="book.link.size.metric">
              <option value="KB">KB</option>
              <option value="MB">MB</option>
              <option value="GB">GB</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="format">File Format</label>
            <select id="format" v-model="book.link.format">
              <option value="pdf">PDF</option>
              <option value="epub">EPUB</option>
              <option value="mobi">MOBI</option>
              <option value="azw3">AZW3</option>
              <option value="txt">TXT</option>
            </select>
          </div>
          
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
      <div class="form-actions">
        <button type="button" @click="resetForm" class="btn-secondary">Reset</button>
        <button type="submit" class="btn-primary">Submit</button>
      </div>
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
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      font-size: 0.9rem;
    }
    
    input[type="text"],
    input[type="number"],
    input[type="url"],
    select {
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
    }
    
    select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8.825L1.175 4 2.05 3.125 6 7.075 9.95 3.125 10.825 4z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      padding-right: 2.5rem;
    }
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
  
  // Tag input styling
  .tag-input {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    min-height: 3rem;
    
    input {
      flex: 1;
      border: none;
      outline: none;
      padding: 0.5rem;
      font-size: 0.9rem;
      
      &:focus {
        box-shadow: none;
      }
    }
    
    .tag {
      display: inline-flex;
      align-items: center;
      background-color: #e8f0fe;
      color: #1a73e8;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      margin: 0.25rem;
      font-size: 0.85rem;
      
      .tag-remove {
        background: none;
        border: none;
        color: #5f6368;
        cursor: pointer;
        font-size: 1rem;
        line-height: 1;
        margin-left: 0.25rem;
        padding: 0 0.15rem;
        
        &:hover {
          color: #d93025;
        }
      }
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
  
  // Form actions
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
    
    button {
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      
      &.btn-primary {
        background-color: #4a90e2;
        color: white;
        border: none;
        
        &:hover {
          background-color: #3a7ec7;
        }
      }
      
      &.btn-secondary {
        background-color: white;
        color: #333;
        border: 1px solid #ddd;
        
        &:hover {
          background-color: #f5f5f5;
        }
      }
    }
  }
}
</style>