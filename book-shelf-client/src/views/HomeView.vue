<script setup lang="ts">
import HorizontalScroll from '@/components/HorizontalScroll.vue';
</script>

<template>
 <div class="home-view">
  <div class="search-bar">
    <i class="fas fa-search"></i> <input type="text" placeholder="Search book">
  </div>
  <div class="recommended-view">
    <div class="view-heading">
      <h2 class="view-title">Recommended</h2>
      <div class="view-options">
        <button id="see-all-button" class="">See All</button>
      </div>
    </div>
    <horizontal-scroll></horizontal-scroll>
  </div>
  <div class="search-view"></div>
 </div>
</template>

<style scoped lang="scss">
.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search-bar {
  width: 40%;
  position: relative;
  top: -55px;
  background-color: #9598d2;
  padding: 40px;
  border-radius: 0 0 60% 60%;

  input {
    width: 240px;
    margin-top: 20px;
    margin-bottom: -20px;
    padding: 10px 15px;
    border: none;
    border-radius: 15px;
    font-size: 1rem;
    color: #2c3e50;
    background-color: #f1f1f1;
    outline: none;
    transition: box-shadow 0.3s ease-in-out;
  }

  &::placeholder {
      color: #b3b3b3;
    }

    &:focus {
      box-shadow: 0 0 10px #7175d1;
  }
}

@media (max-width: 1024px) {
  .search-bar {
    width: 80%;
  }
}

@media (min-width: 1920px) {
  .search-bar {
    width: 50%;
  }
}

.recommended-view {
  margin-top: -35px;
  background-color: white;
  width: 95%;
  border-radius: 13px;
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
