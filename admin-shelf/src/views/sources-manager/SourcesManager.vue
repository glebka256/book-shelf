<script setup lang="ts">
import { ref } from "vue";
import ActionNav from "@/components/ui/ActionNav.vue";
import ActionTab from "@/components/ui/ActionTab.vue";
import HomeCard from "./components/HomeCard.vue";
import SourceTab from "./components/SourceTab.vue";
import { QueryField } from "./sourcesManager.types";

const activeTab = ref('home');

/** Tabs displayed on ActionNav. Not all tabs are visible */
const visibleTabs = [
  { id: "home",          name: "Home"           },
  { id: "goodreads",     name: "Goodreads"      },
  { id: "annas-archive", name: "Anna's Archive" },
  { id: "open-lib",      name: "Open Lib"       },
  { id: "gutenberg",     name: "Gutenberg"      },
  { id: "best-books",    name: "Best Books"     },
];

// Handle tab changes from ActionNav
const handleTabChange = (tab: string) => {
  activeTab.value = tab;
};

const goodreadsFormFields: QueryField[] = [
  {
    id: "query",
    label: "Query *",
    placeholder: "Enter book title, author, or ISBN",
    required: true,
    type: "text"
  }
];
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
    <ActionTab tabId="home" :activeTab="activeTab">
      <HomeCard :tabs="visibleTabs" @select-tab="handleTabChange" />
    </ActionTab>

    <ActionTab tabId="goodreads" :activeTab="activeTab">
      <SourceTab 
        sourceName="Goodreads API" 
        :queryFields="goodreadsFormFields"
        :infoTag="{ email: 'glebkarpenko1@gmail.com' }" 
      />
    </ActionTab>

    <ActionTab tabId="annas-archive" :activeTab="activeTab">
      <h3>Annas tab</h3>
    </ActionTab>

    <ActionTab tabId="open-lib" :activeTab="activeTab">
      <h3>Open lib tab</h3>
    </ActionTab>

    <ActionTab tabId="gutenberg" :activeTab="activeTab">
      <h3>Gutenberg tab</h3>
    </ActionTab>

    <ActionTab tabId="best-books" :activeTab="activeTab">
      <h3>Best books</h3>
    </ActionTab>
 </div>
</template>

<style scoped lang="scss">
// TODO import this shared style as global
.sources-manager {
  margin: 0 0 auto 2rem;
  padding: 1rem;
}
</style>