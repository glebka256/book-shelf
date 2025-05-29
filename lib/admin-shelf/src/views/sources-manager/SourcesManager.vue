<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { QueryField } from "./sourcesManager.types";
import * as api from "./sourcesManager";

import ActionNav from "@/components/ui/ActionNav.vue";
import ActionTab from "@/components/ui/ActionTab.vue";
import HomeCard from "./components/HomeCard.vue";
import SourceTab from "./components/SourceTab.vue";
import GoodreadsDoc from "@/views/documentation-card/sources-docs/GoodreadsDoc.vue";
import OpenLibDoc from "../documentation-card/sources-docs/OpenLibDoc.vue";
import GutenbergDoc from "../documentation-card/sources-docs/GutenbergDoc.vue";
import GutenbergDetailedDoc from "../documentation-card/sources-docs/GutenbergDetailedDoc.vue";
import AnnasDoc from "../documentation-card/sources-docs/AnnasDoc.vue";
import BestBookDoc from "../documentation-card/sources-docs/BestBookDoc.vue";
import BestBookDetailed from "../documentation-card/sources-docs/BestBookDetailed.vue";

const route = useRoute();
const router = useRouter();

/** Map of route paths to tab IDs */
const routeToTabMap: { [key: string]: string } = {
  'home': 'home',
  'goodreads': 'goodreads',
  'open-lib': 'open-lib',
  'gutenberg-search': 'gutenberg-search',
  'gutenberg-detailed': 'gutenberg-detailed',
  'annas-archive': 'annas-archive',
  'best-all': 'best-all',
  'best-detailed': 'best-detailed'
};

/** Map of tab IDs to route names */
const tabToRouteMap: { [key: string]: string } = {
  'home': 'sources-manager-home',
  'goodreads': 'sources-manager-goodreads',
  'open-lib': 'sources-manager-open-lib',
  'gutenberg-search': 'sources-manager-gutenberg-search',
  'gutenberg-detailed': 'sources-manager-gutenberg-detailed',
  'annas-archive': 'sources-manager-annas-archive',
  'best-all': 'sources-manager-best-all',
  'best-detailed': 'sources-manager-best-detailed'
};

// activeTab is recieved from route
const activeTab = computed(() => {
  const currentPath = route.path.split('/').pop() || 'home';
  return routeToTabMap[currentPath] || 'home';
});

/** Tabs displayed on ActionNav. Not all tabs are visible */
const visibleTabs = [
  { id: "home",               name: "Home"               },
  { id: "goodreads",          name: "Goodreads"          },
  { id: "open-lib",           name: "Open Lib"           },
  { id: "gutenberg-search",   name: "Gutenberg"          },
  { id: "gutenberg-detailed", name: "Gutenberg Detailed" },
];

/** Handles tab changes from ActionNav */
const handleTabChange = (tab: string): void => {
  const routeName = tabToRouteMap[tab];
  if (routeName && route.name !== routeName) {
    router.push({ name: routeName });
  }
};

// Query forms
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
    label: "Author *",
    placeholder: "Enter book author to narrow down search",
    required: true,
    type: "text"
  },
  {
    id: "cat",
    label: "Category *",
    placeholder: "Enter book category to narrow down search",
    required: true,
    type: "text"
  },
  {
    id: "access",
    label: "Access *",
    placeholder: "Enter public access status (true for public only, false for any)",
    required: true,
    type: "text"
  },
  {
    id: "lang",
    label: "Language *",
    placeholder: "Enter book language code to narrow down search",
    required: true,
    type: "text"
  }
];

const gutenbergSearchFormFields: QueryField[] = [
  {
    id: "page",
    label: "Page",
    placeholder: "Select numeric value",
    required: false,
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
        :queryFields="goodreadsFormFields"
        :fetchData="api.fetchGoodreadsData"
        :infoTag="{ email: 'glebkarpenko1@gmail.com' }" 
      ><GoodreadsDoc /></SourceTab>
    </ActionTab>

    <ActionTab tabId="annas-archive" :activeTab="activeTab">
      <SourceTab 
        :queryFields="annasFormFields"
        :fetchData="api.fetchAnnasArchiveData"
        :infoTag="{ email: 'glebkarpenko1@gmail.com' }" 
      ><AnnasDoc /></SourceTab>
    </ActionTab>

    <ActionTab tabId="best-all" :activeTab="activeTab">
      <SourceTab 
        sourceName="Best Books API" 
        :queryFields="bestAllFormFields"
        :fetchData="api.fetchBestBooksData"
        :infoTag="{ email: 'glebkarpenko1@gmail.com' }" 
      ><BestBookDoc /></SourceTab>
    </ActionTab>

    <ActionTab tabId="best-detailed" :activeTab="activeTab">
      <SourceTab 
        sourceName="Best Books Detailed API" 
        :queryFields="bestDetailedFormFields"
        :fetchData="api.fetchBestBooksdetailedData"
        :infoTag="{ email: 'glebkarpenko1@gmail.com' }" 
      ><BestBookDetailed /></SourceTab>
    </ActionTab>

    <ActionTab tabId="open-lib" :activeTab="activeTab">
      <SourceTab 
        :queryFields="openLibFormFields"
        :fetchData="api.fetchOpenLibData"
        :infoTag="{ email: 'glebkarpenko1@gmail.com' }" 
      ><OpenLibDoc /></SourceTab>
    </ActionTab>

    <ActionTab tabId="gutenberg-search" :activeTab="activeTab">
      <SourceTab 
        :queryFields="gutenbergSearchFormFields"
        :fetchData="api.fetchGutenbergData"
        :infoTag="{ email: 'glebkarpenko1@gmail.com' }" 
      ><GutenbergDoc /></SourceTab>
    </ActionTab>

    <ActionTab tabId="gutenberg-detailed" :activeTab="activeTab">
      <SourceTab 
        :queryFields="gutenbergDetailsFormFields"
        :fetchData="api.fetchGutenbergDetailedData"
        :infoTag="{ email: 'glebkarpenko1@gmail.com' }" 
      ><GutenbergDetailedDoc /></SourceTab>
    </ActionTab>
 </div>
</template>

<style scoped lang="scss">
@import '@/styles/manager.scss';

.sources-manager {
  @extend %manager-base;
}
</style>