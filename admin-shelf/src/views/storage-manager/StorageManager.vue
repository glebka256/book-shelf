<script setup lang="ts">
import { ref } from 'vue';
import ActionNav from './components/ActionNav.vue';
import ActionTab from './components/ActionTab.vue';

// Active tab to be displayed in StorageManager
const activeTab = ref('books');

// Handle tab changes from ActionNav
const handleTabChange = (tab: string) => {
  activeTab.value = tab;
};
</script>

<template>
  <div class="store-manager"> 
    <!-- Navigation component -->
    <ActionNav 
      :activeTab="activeTab" 
      @select-tab="handleTabChange" 
    />
    
    <!-- Tab content containers -->
    <ActionTab tabId="books" :activeTab="activeTab">
      <h2>Books Library</h2>
      <p>Your book inventory will appear here.</p>
    </ActionTab>
    
    <ActionTab tabId="create" :activeTab="activeTab">
      <h2>Create New Book</h2>
      <p>Form to add a new book will appear here.</p>
    </ActionTab>
    
    <ActionTab tabId="stats" :activeTab="activeTab">
      <h2>Store Statistics</h2>
      <p>Sales and inventory statistics will appear here.</p>
    </ActionTab>
  </div>
</template>

<style scoped lang="scss">
.store-manager {
  margin: 0 0 auto 2rem;
  padding: 1rem;
  
  h1 {
    margin-bottom: 1.5rem;
    color: #333;
  }
}
</style>