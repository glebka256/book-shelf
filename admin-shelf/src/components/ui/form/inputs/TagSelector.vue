<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

interface TagSelectorProps {
  id: string,
  label: string,
  tags: string[],
  placeholder?: string,
}

const props = defineProps<TagSelectorProps>();

const emit = defineEmits<{
  (e: 'update:tags', value: string[]): void;
  (e: 'add', value: string): void;
  (e: 'remove', index: number): void;
}>();

const newTag = ref<string>('');

const addTag = (): void => {
  if (newTag.value.trim()) {
    // Create a copy of the tags array to maintain reactivity
    const updatedTags = [...props.tags, newTag.value.trim()];
    emit('update:tags', updatedTags);
    emit('add', newTag.value.trim());
    newTag.value = '';
  }
};

const removeTag = (index: number): void => {
  const updatedTags = [...props.tags];
  updatedTags.splice(index, 1);
  emit('update:tags', updatedTags);
  emit('remove', index);
};
</script>

<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <div class="tag-input">
      <div 
        v-for="(tag, index) in tags" 
        :key="`tag-${index}`" 
        class="tag" :id="id"
      >
        {{ tag }}
        <button type="button" @click="removeTag(index)" class="tag-remove">&times;</button>
      </div>
      <input
        v-model="newTag"
        @keydown.enter.prevent="addTag"
        type="text"
        :placeholder="placeholder || `Add ${label.toLowerCase()} and press Enter`"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
// TODO: remove form-group styling after proper wrapper is implemented
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
</style>