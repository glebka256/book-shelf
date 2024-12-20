<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  placeholder: {
    type: String,
    required: false,
    default: "Search book"
  }
});
</script>

<template>
 <div class="search-bar">
  <i class="fas fa-search"></i> <input type="text" :placeholder=placeholder>
 </div>
</template>

<style scoped lang="scss">
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
</style>