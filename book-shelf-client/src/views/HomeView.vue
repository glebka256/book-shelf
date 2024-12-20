<script setup lang="ts">
import HorizontalScroll from '@/components/HorizontalScroll.vue';
import SearchBar from '@/components/SearchBar.vue';
</script>

<template>
 <div class="home-view">
  <search-bar placeholder="Search book" />
  <div class="recommended-view">
    <div class="view-heading">
      <h2 class="view-title">Recommended</h2>
      <div class="view-options">
        <button id="see-all-button" class="">See All</button>
      </div>
    </div>
    <horizontal-scroll></horizontal-scroll>
  </div>
  <div class="search-view">
    <div class="view-heading">
      <h2 class="view-title">Discover new</h2>
      <div class="view-options">
        <button id="see-all-button" class="">See All</button>
      </div>
    </div>
  </div>
 </div>
</template>

<style scoped lang="scss">
.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.recommended-view, .search-view {
  margin-top: -35px;
  background-color: white;
  width: 90%;
  border-radius: 13px;
}

.search-view {
  margin-top: 20px;
}

.view-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 25px;
}

.view-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.view-options {
  display: flex;
  align-items: center;
  margin-right: 25px;
}

#see-all-button {
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
  background-color: #7175d1;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #5c60c0;
  }

  &:active {
    background-color: #4a4eaf;
    transform: scale(0.95);
  }
}
</style>
