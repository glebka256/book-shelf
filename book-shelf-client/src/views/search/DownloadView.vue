<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import SearchTemplate from '@/components/layout/SearchTemplate.vue';
import SuggestionCard from '@/components/common/SuggestionCard.vue';

const resultsPresent  = ref<boolean>(false);
const searchQuery = ref<string>(); 
const route = useRoute();

function handleBookFetch(booksAmount: number) {
  // Get search query so that user doesn't have to enter it again when going to extended search page.
  searchQuery.value = (route.query.q as string) || '';

  resultsPresent.value = booksAmount > 0;
}
</script>

<template>
 <div class="download-view"> 
  <SearchTemplate
    search-type="downloadable" 
    @results-loaded="handleBookFetch" 
  />
  <SuggestionCard 
    v-if="!resultsPresent"
    message="No downloadable version of the book you are searching was found. You can still look for it here: "
    link-label="Search All Books."
    :link="`/search?q=${searchQuery}`"
  />
 </div>
</template>

<style scoped lang="scss">

</style>