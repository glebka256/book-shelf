<script setup lang="ts">
import { ref } from "vue";
import ActionNav from "@/components/ui/ActionNav.vue";
import ActionTab from "@/components/ui/ActionTab.vue";

const activeTab = ref('home');

/** Tabs displayed on ActionNav. Not all tabs are visible */
const visibleTabs = [
  { id: "home",          name: "Home"           },
  { id: "goodreads",     name: "Goodreads"      },
  { id: "annas-archive", name: "Anna's Archive" },
  { id: "open-lib",      name: "Open Lib"       },
  { id: "gutenberg",      name: "Gutenberg"      },
  { id: "best-books",    name: "Best Books"     },
];

// Handle tab changes from ActionNav
const handleTabChange = (tab: string) => {
  activeTab.value = tab;
};

</script>

<template>
 <div class="sources-manager">
    <!-- Navigation component -->
    <ActionNav 
      :tabs="visibleTabs"
      :activeTab="activeTab"
      title="Sources Manager"
      @select-tab="handleTabChange"
    />
    
    <!-- Tab content containers -->
    <ActionTab tabId="home" :activeTab="activeTab"></ActionTab>

    <ActionTab tabId="goodreads" :activeTab="activeTab"></ActionTab>

    <ActionTab tabId="annas-archive" :activeTab="activeTab"></ActionTab>

    <ActionTab tabId="open-lib" :activeTab="activeTab"></ActionTab>

    <ActionTab tabId="gutenberg" :activeTab="activeTab"></ActionTab>

    <ActionTab tabId="best-books" :activeTab="activeTab"></ActionTab>
 </div>
</template>

<style scoped lang="scss">
// TODO import this shared style as global
.sources-manager {
  margin: 0 0 auto 2rem;
  padding: 1rem;
}
</style>