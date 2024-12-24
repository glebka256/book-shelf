<script setup lang="ts">
import { ref } from 'vue';
import InputSelector from '@/components/InputSelector.vue';
import IconButton from '@/components/IconButton.vue';

const categories = ref<string[]>(["fiction", "non-fiction", "science", "fantasy","epic_fantasy", "dark_fantasy", "mystery", "romance", "thriller", "horror", "historical_fiction", "science_fiction", "literary_fiction", "young_adult", "children's_books", "classics", "adventure", "crime", "paranormal", ]);
const selectedCategories = ref<string[]>([]);

function addCategory(category: string) {
  if (!selectedCategories.value.includes(category)) {
    selectedCategories.value.push(category);

    const index = categories.value.indexOf(category);
    if (index !== -1) {
      categories.value.splice(index, 1);
    }
  }
}

function deleteCategory(category: string) {
  if (selectedCategories.value.includes(category)) {
    const index = selectedCategories.value.indexOf(category);
    if (index !== -1) {
      selectedCategories.value.splice(index, 1);
    }

    categories.value.push(category);
  }
}
</script>

<template>
  <form class="filter-form">
      <div class="filter-row applied-margin applied-shrink">
        <div class="filter-cell">
          <input-selector 
            label-text="Category" 
            :options="categories"
            placeholder="Choose category" 
            @select-option="addCategory"
          />
          <icon-button icon-type="reset" />
        </div>
        <div class="filter-cell">
          <input-selector 
            label-text="Language" 
            :options="categories"
            placeholder="Choose language" 
            @select-option="addCategory"
          />
          <icon-button icon-type="reset" />
        </div>
      </div>
      <div class="filter-row applied-shrink">
        <div class="filter-cell">
          <input-selector 
            label-text="Downloadable" 
            :options="categories"
            placeholder="Chose download type" 
            @select-option="addCategory"
          />
          <icon-button icon-type="reset" />    
        </div>
        <div class="filter-cell">
          <input-selector 
            label-text="Read access" 
            :options="categories"
            placeholder="Choose accessability" 
            @select-option="addCategory"
          />
          <icon-button icon-type="reset" />
        </div>
      </div>
  </form>
</template>

<style scoped lang="scss">
.filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.applied-margin {
    margin-bottom: 14px;
  }

  .filter-cell {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
  }

  .input-selector {
    flex-shrink: 0;
    width: auto;
  }
}

@media (max-width: 1084px) {
  .filter-row {

    &.applied-shrink {
      flex-direction: column;
    }

    &.applied-margin {
      margin-bottom: 0;
    }

    .filter-cell {
      margin-bottom: 14px;
      margin-right: auto;
    }
  }
}
</style>
