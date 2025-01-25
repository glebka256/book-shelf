<script setup lang="ts">
import { defineProps, PropType, defineEmits, onMounted, onBeforeUnmount, ref, watch, reactive } from 'vue';
import { useRoute } from 'vue-router';
import SearchBar from '@/components/common/SearchBar.vue';
import BookSkeleton from '@/components/book/BookSkeleton.vue';
import BookGrid from '@/components/book/BookGrid.vue';
import BookSidebar from '@/components/book/BookSidebar.vue';
import TextLoader from '@/components/common/loaders/TextLoader.vue';
import { Book, SearchMethods, SearchMethod } from '@/types/Book';
import { useInteractionStore } from '@/store/interactionStore';
import { InteractionTypes } from '@/types/User';
import { getSearchResults } from '@/api/book';

const props = defineProps({
  searchType: {
    type: String as PropType<keyof typeof SearchMethods>,
    required: true
  }
})

const emit = defineEmits(['results-loaded']);

const searchType: SearchMethod = SearchMethods[props.searchType];

const loading = reactive({
  page: false,
  more: false,
  complete: false
});

const page = ref<number>(1);

const route = useRoute();
const books = ref<Book[]>([]);

async function fetchSearchResult(query: string): Promise<Book[]> {
  if (!query.trim()) {
    return [];
  }
  
  try {
    const results = await getSearchResults(query, page.value, searchType);
    page.value += 1;

    loading.complete = results.searchComplete;
    return results.data as Book[];
  } catch (error) {
    console.error(`Could not fetch search results by query: ${query}\nError: ${error}`);
    return [];
  }
}

async function updateSearch(query: string) {
  page.value = 1;
  loading.page = true;

  // Overwrites books with new search query result.
  books.value = await fetchSearchResult(query);
  page.value += 1;

  loading.page = false;
  emit('results-loaded', books.value.length);
}

async function loadMore(query: string) {
  loading.more = true;

  // Loads more books with the same search query.
  const moreBooks = await fetchSearchResult(query);
  books.value = [...books.value, ...moreBooks];

  loading.more = false;
}

const selectedBookId = ref<string>('');
const isSidebarOpen = ref<boolean>(false);

async function handleBookSelect(bookId: string) {
  await openSidebar(bookId);

  const interactionStore = useInteractionStore();
  interactionStore.saveInteraction(InteractionTypes.Searched, bookId);
}

async function openSidebar(bookId: string) {
  if (isSidebarOpen.value) {
    closeSidebar();

    // Delay to make sure sidebar closes before opening a new one. 
    await setTimeout(() => {/* */}, 0);
  }

  selectedBookId.value = bookId;
  isSidebarOpen.value = true;
}

function closeSidebar() {
  isSidebarOpen.value = false;
}

// Watch the query parameter for changes
watch(() => route.query.q, async () => {
  await updateSearch((route.query.q) as string || '');
});

const bottomObserver = ref<IntersectionObserver | null>(null);
const bottomRef = ref<HTMLDivElement>();

onMounted(async () => {
  await updateSearch((route.query.q) as string || '');

  bottomObserver.value = new IntersectionObserver((entries) => {
    const isLoading = Object.values(loading).some((value) => value);

    if (entries[0].isIntersecting && !isLoading) {
      loadMore((route.query.q) as string || '');      
    }
  });

  if (bottomRef.value) {
    bottomObserver.value.observe(bottomRef.value);
  }
});

onBeforeUnmount(() => {
  if (bottomObserver.value && bottomRef.value) {
    bottomObserver.value.unobserve(bottomRef.value);
  }
});

</script>

<template>
<div class="search-template">
  <div class="empty-top"></div>
  <search-bar @submit="updateSearch" :submitPath="searchType.path" />
  <h2 class="view-title">{{ searchType.title }}</h2>
  <div v-if="loading.page" class="book-skeleton">
    <book-skeleton :skeleton-type="'vertical'" />
  </div>
  <book-grid 
    v-else-if="books.length > 0"
    class="search-content" 
    :books="books"
    @select-book="handleBookSelect" 
  />
  <book-sidebar 
    v-if="isSidebarOpen"
    :bookId="selectedBookId"
    @close="closeSidebar"
  />
  <div v-if="loading.more" class="load-more">
    <TextLoader loader-text="Loading more books..."/>
  </div>
  <div ref="bottomRef" class="bottom-observer"></div>
</div>
</template>

<style scoped lang="scss">
.search-template {
  display: flex;
  flex-direction: column;
  align-items: center;
}

// Used to to prevent content from going under the search bar before scroll.
// Removing makes search bar twitch on first scroll.
.empty-top {
  height: 64px;
}

// Just used to apply observer to it's reference, should not be visible.
.bottom-observer {
  height: 1px;
}

.search-content, .book-skeleton {
  width: 70%;
  margin: 20px auto;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
}
</style>
