<script setup lang="ts">
import { ref } from "vue";
import ActionNav from "@/components/ui/ActionNav.vue";
import ActionTab from "@/components/ui/ActionTab.vue";
import HomeCard from "./components/HomeCard.vue";
import SourceTab from "./components/SourceTab.vue";
import GoodreadsDoc from "@/views/documentation-card/sources-docs/GoodreadsDoc.vue";
import { QueryField } from "./sourcesManager.types";
import * as api from "./sourcesManager";

const activeTab = ref('home');

/** Tabs displayed on ActionNav. Not all tabs are visible */
const visibleTabs = [
  { id: "home",               name: "Home"               },
  { id: "goodreads",          name: "Goodreads"          },
  { id: "open-lib",           name: "Open Lib"           },
  { id: "gutenberg-search",   name: "Gutenberg"          },
  { id: "gutenberg-detailed", name: "Gutenberg Detailed" },
  { id: "annas-archive",      name: "Anna's Archive"     },
  { id: "best-all",           name: "Best Books"         },
  { id: "best-detailed",      name: "Best Books Details" },
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

const annasFormFields: QueryField[] = [
  {
    id: "query",
    label: "Query *",
    placeholder: "Enter book title, keyword or ISBN",
    required: true,
    type: "text"
  },
  {
    id: "author",
    label: "Author",
    placeholder: "Enter book author",
    required: false,
    type: "text"
  },
  {
    id: "cat",
    label: "Category",
    placeholder: "Enter book category, for ex 'science'",
    required: false,
    type: "text"
  },
];

const bestAllFormFields: QueryField[] = [
  {
    id: "genre",
    label: "Genre *",
    placeholder: "Enter book genre, for ex 'romance'",
    required: true,
    type: "text"
  }
];

const bestDetailedFormFields: QueryField[] = [
  {
    id: "id",
    label: "Best Books ID (get from Best Book API if needed) *",
    placeholder: "Enter numeric id",
    required: true,
    type: "number"
  }
];

const openLibFormFields: QueryField[] = [
  {
    id: "q",
    label: "Query *",
    placeholder: "Enter book query by ISBN, open Lib id, title, author or any other keywod",
    required: true,
    type: "text"
  },
  {
    id: "author",
    label: "Author",
    placeholder: "Enter book author to narrow down search",
    required: false,
    type: "text"
  },
  {
    id: "cat",
    label: "Category",
    placeholder: "Enter book category to narrow down search",
    required: false,
    type: "text"
  },
  {
    id: "access",
    label: "Access",
    placeholder: "Enter book access (true or false) to narrow down search",
    required: false,
    type: "text"
  },
  {
    id: "lang",
    label: "Language",
    placeholder: "Enter book language code to narrow down search",
    required: false,
    type: "text"
  }
];

const gutenbergSearchFormFields: QueryField[] = [
  {
    id: "page",
    label: "Page *",
    placeholder: "Select numeric value",
    required: true,
    type: "number"
  }
];

const gutenbergDetailsFormFields: QueryField[] = [
  {
    id: "id",
    label: "ID *",
    placeholder: "Enter Gutenberg ID, can get from Gutenberg API",
    required: true,
    type: "number"
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
        :fetchData="api.fetchGoodreadsData"
        :infoTag="{ email: 'glebkarpenko1@gmail.com' }" 
      ><GoodreadsDoc /></SourceTab>
    </ActionTab>

    <ActionTab tabId="annas-archive" :activeTab="activeTab">
      <SourceTab 
        sourceName="Annas Archive API" 
        :queryFields="annasFormFields"
        :fetchData="api.fetchAnnasArchiveData"
        :infoTag="{ email: 'glebkarpenko1@gmail.com' }" 
      />
    </ActionTab>

    <ActionTab tabId="best-all" :activeTab="activeTab">
      <SourceTab 
        sourceName="Best Books API" 
        :queryFields="bestAllFormFields"
        :fetchData="api.fetchBestBooksData"
        :infoTag="{ email: 'glebkarpenko1@gmail.com' }" 
      />
    </ActionTab>

    <ActionTab tabId="best-detailed" :activeTab="activeTab">
      <SourceTab 
        sourceName="Best Books Detailed API" 
        :queryFields="bestDetailedFormFields"
        :fetchData="api.fetchBestBooksdetailedData"
        :infoTag="{ email: 'glebkarpenko1@gmail.com' }" 
      />
    </ActionTab>

    <ActionTab tabId="open-lib" :activeTab="activeTab">
      <SourceTab 
        sourceName="Open Library API" 
        :queryFields="openLibFormFields"
        :fetchData="api.fetchOpenLibData"
        :infoTag="{ email: 'glebkarpenko1@gmail.com' }" 
      />
    </ActionTab>

    <ActionTab tabId="gutenberg-search" :activeTab="activeTab">
      <SourceTab 
        sourceName="Gutenberg API" 
        :queryFields="gutenbergSearchFormFields"
        :fetchData="api.fetchGutenbergData"
        :infoTag="{ email: 'glebkarpenko1@gmail.com' }" 
      />
    </ActionTab>

    <ActionTab tabId="gutenberg-detailed" :activeTab="activeTab">
      <SourceTab 
        sourceName="Gutenberg Detailed API" 
        :queryFields="gutenbergDetailsFormFields"
        :fetchData="api.fetchGutenbergDetailedData"
        :infoTag="{ email: 'glebkarpenko1@gmail.com' }" 
      />
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