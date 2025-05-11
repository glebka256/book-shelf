<script setup lang="ts">
import { ref } from 'vue';
import SearchTemplate from '@/components/layout/SearchTemplate.vue';
import SuggestionCard from '@/components/common/SuggestionCard.vue';

const resultsPresent  = ref<boolean>(false);

function handleBookFetch(booksAmount: number) {
  resultsPresent.value = booksAmount > 0;
}
</script>

<template>
 <div class="search-view"> 
  <SearchTemplate
    search-type="all" 
    @results-loaded="handleBookFetch" 
  />
  <SuggestionCard 
    v-if="!resultsPresent"
    message="No book found. Try searching by another keyword or "
    link-label="discover more books."
    link="/"
  />
 </div>
</template>

<style scoped lang="scss">

</style>