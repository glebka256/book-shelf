<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';
import { useRouter } from 'vue-router';

defineProps({
  placeholder: {
    type: String,
    required: false,
    default: "Search by title, author, subject, etc."
  }
});

const emit = defineEmits(['submit']);

const router = useRouter();
const query = ref('');

function validateInput(): boolean {
  if (!query.value.trim()) {
    alert("Enter search term first");
    return false;
  }

  if (query.value.length < 3) {
    alert("Search term should be at least 3 characters long");
    return false;
  }

  if (query.value.length > 165) {
    alert("Use shorter search term");
    return false;
  }
  return true;
}

async function submitSearch() {
  if (validateInput()) {
    emit('submit', query.value);
    
    router.push({
      path: '/search',
      query: { q: query.value.trim() }
    });
  }
}
</script>

<template>
  <form 
    class="search-bar" 
    ref="searchBar" 
    @submit="submitSearch" 
    @submit.prevent="submitSearch"
  >
    <div class="input-container">
      <input 
        type="text" 
        class="search-bar-input"
        v-model="query" 
        :placeholder=placeholder
      >
      <button 
        id="search-button" 
        class="search-bar-input"
        type="submit"
      >
        <i class="fas fa-search"></i>
      </button>
    </div>
  </form>
</template>
 
<style scoped lang="scss">
.search-bar {
  position: fixed;
  z-index: 1000;
  top: -34px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60%;
  max-width: 720px;
  background-color: #9598d2;
  padding: 40px;
  border-radius: 0 0 60% 60%;

  .input-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 62%;
    min-width: 240px;
    max-width: 600px;
    //margin-top: 22px;
    margin-bottom: -28px;
    color: #2c3e50;

    .search-bar-input {
      padding: 10px 15px;
    }

    button {
      border: none;
      align-self: flex-end;
      border-radius: 0 20px 20px 0;

      i {
        padding-top: 1px;
        padding-right: 4px;
        font-size: 1.1rem;
      }
    }

    input {
      align-self: flex-start;
      border-radius: 20px 0 0 20px;

      width: 100%;
      font-size: 1rem;
      outline: none;
      border: none;
      transition: box-shadow 0.3s ease-in-out;

      &::placeholder {
        color: #b3b3b3;
      }

      &:focus {
        box-shadow: 0 0 10px #7175d1;
      }
    }
  }
}

@media (max-width: 1024px) {
  .search-bar {
    width: 80%;
  }
}
</style>
