<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import InputSelector from '@/components/InputSelector.vue';
import IconButton from '@/components/IconButton.vue';
import { FilterOptions, FilterGenre, FilterQuery } from '@/types/Filter';
import baseInstance from '@/api/baseInstance';

const categories = ref<string[]>([]);
const languages = ref<string[]>([]);
const loading = ref<boolean>(true);

const selectedOptions = reactive<FilterQuery>({
  subjects: [],
  languages: [],
  downloadable: false,
  readable: false
});

async function fetchOptions() {
  try {
    const response = await baseInstance.get<FilterOptions>(
      `/books/filter/options`
    );

    const genres = response.data.genre as FilterGenre[];
    categories.value = genres.map((genre) => (genre.name));
    languages.value = response.data.language;
  } catch (error) {
    console.error(`Could not fetch popular books. Error: ${error}`);
    loading.value = false;
  } finally {
    loading.value = false;
  }
}

function addCategory(category: string) {
  if (!selectedOptions.subjects.includes(category)) {
    selectedOptions.subjects.push(category);

    const index = categories.value.indexOf(category);
    if (index !== -1) {
      categories.value.splice(index, 1);
    }
  }
}

function deleteCategory(category: string) {
  if (selectedOptions.subjects.includes(category)) {
    const index = selectedOptions.subjects.indexOf(category);
    if (index !== -1) {
      selectedOptions.subjects.splice(index, 1);
    }

    categories.value.push(category);
  }
}

onMounted(() => {
  fetchOptions();
});
</script>

<template>
  <form class="filter-form" v-if="!loading">
      <div class="filter-row applied-margin applied-shrink">
        <div class="filter-cell">
          <input-selector 
            label-text="Add Categories" 
            :options="categories"
            placeholder="Choose category" 
            @select-option="addCategory"
          />
          <icon-button icon-type="reset" />
        </div>
        <div class="filter-cell">
          <input-selector 
            label-text="Language" 
            :options="languages"
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
            :options="['Only downloadable']"
            placeholder="Choose access" 
            @select-option="addCategory"
          />
          <icon-button icon-type="reset" />    
        </div>
        <div class="filter-cell">
          <input-selector 
            label-text="Read access" 
            :options="['Only readable']"
            placeholder="Choose access" 
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
