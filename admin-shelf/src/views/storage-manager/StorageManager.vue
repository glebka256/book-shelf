<script setup lang="ts">
import { ref } from 'vue';
import ActionNav from '@/components/ui/ActionNav.vue';
import ActionTab from '@/components/ui/ActionTab.vue';
import BooksView from './books-view/BooksView.vue';
import BookForm from './book-form/BookForm.vue';

const activeTab = ref('books');

const tabs = [
  { id: "books",  name: "Books"      },
  { id: "create", name: "Create"     },
  { id: "stats",  name: "Statistics" },
]

// Handle tab changes from ActionNav
const handleTabChange = (tab: string) => {
  activeTab.value = tab;
};
</script>

<template>
  <div class="store-manager"> 
    <!-- Navigation component -->
    <ActionNav 
      :tabs="tabs"
      :activeTab="activeTab"
      title="Storage Manager"
      @select-tab="handleTabChange"
    />
    
    <!-- Tab content containers -->
    <ActionTab tabId="books" :activeTab="activeTab">
      <BooksView 
        @edit="handleTabChange('edit')"
        @remove="handleTabChange('remove')"  
      />
    </ActionTab>
    
    <ActionTab tabId="create" :activeTab="activeTab">
      <BookForm />
    </ActionTab>
    
    <ActionTab tabId="stats" :activeTab="activeTab">
      <h2>Store Statistics</h2>
      <p>Sales and inventory statistics will appear here.</p>
    </ActionTab>

    <ActionTab tabId="edit" :activeTab="activeTab">
      <h3>Edit tab</h3>
    </ActionTab>

    <ActionTab tabId="remove" :activeTab="activeTab">
      <h3>Remove tab</h3>
    </ActionTab>
  </div>
</template>

<style scoped lang="scss">
.store-manager {
  margin: 0 0 auto 2rem;
  padding: 1rem;
}
</style>