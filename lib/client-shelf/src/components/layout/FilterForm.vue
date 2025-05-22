<script setup lang="ts">
import { ref, onMounted, reactive, defineExpose, defineEmits, nextTick, watch, onBeforeUnmount } from 'vue';
import InputSelector from '@/components/common/selectors/InputSelector.vue';
import IconButton from '@/../../component-lib/src/components/buttons/IconButton.vue';
import BookFilter from '@/components/book/BookFilter.vue';
import { FilterOptions, FilterGenre, FilterQuery, AcessOptions } from '@/types/Filter';
import baseInstance from '@/api/baseInstance';
import { calculateTextWidth } from '@/utils';

const emit = defineEmits(['filters-applied']);

// 'all-' variables are used for fetching options only once on mount or reload trigger
let allCategories: string[];
let allLanguages: string[];
const loading = ref<boolean>(true);

// These are separated from -all for managing better UX on input selectors 
const categories = ref<string[]>([]);
const languages = ref<string[]>([]);
const downloadability = ref<string[]>([AcessOptions.All, AcessOptions.Downloadable]);
const readablility = ref<string[]>([AcessOptions.All, AcessOptions.Readable]);

const selectedOptions = reactive<FilterQuery>({
  subjects: [],
  languages: [],
  downloadable: false,
  readable: false
});

defineExpose({
  selectedOptions,
  resetOptions,
  submitOptions
});

async function fetchOptions() {
  try {
    const response = await baseInstance.get<FilterOptions>(
      `/books/filter/options`
    );

    const genres = response.data.genre as FilterGenre[];
    allCategories = genres.map((genre) => (genre.name));
    allLanguages = response.data.language;

    categories.value = [...allCategories];
    languages.value = [...allLanguages];
  } catch (error) {
    console.error(`Could not fetch filtering options. Error: ${error}`);
    loading.value = false;
  } finally {
    loading.value = false;
  }
}

function refreshFilters() {
  setTimeout(() => adjustFilterGrid(), 10);
}

function resetCategories() {
  selectedOptions.subjects = [],
  categories.value = [...allCategories];

  refreshFilters(); 
}

function resetLanguages() {
  selectedOptions.languages = [],
  languages.value = [...allLanguages];

  refreshFilters();
}

// Break down each option reset into it's own function for adding click listeners on their respective buttons.
function resetOptions() {
  resetCategories();
  resetLanguages();
}

async function submitOptions() {
  emit('filters-applied', selectedOptions);
}

function addCategory(category: string) {
  if (!selectedOptions.subjects.includes(category)) {
    selectedOptions.subjects.push(category);

    const index = categories.value.indexOf(category);
    if (index !== -1) {
      categories.value.splice(index, 1);
    }
  }

  refreshFilters();
}

function deleteCategory(category: string) {
  if (selectedOptions.subjects.includes(category)) {
    const index = selectedOptions.subjects.indexOf(category);
    if (index !== -1) {
      selectedOptions.subjects.splice(index, 1);
    }

    categories.value.push(category);
  }

  refreshFilters();
}

function addLanguage(language: string) {
  if (!selectedOptions.languages.includes(language)) {
    selectedOptions.languages.push(language);

    const index = languages.value.indexOf(language);
    if (index !== -1) {
      languages.value.splice(index, 1);
    }
  }

  refreshFilters();
}

function deleteLanguage(language: string) {
  if (selectedOptions.languages.includes(language)) {
    const index = selectedOptions.languages.indexOf(language);
    if (index !== -1) {
      selectedOptions.languages.splice(index, 1);
    }

    languages.value.push(language);
  }

  refreshFilters();
}

function toggleDownloadable(option: string) {
  if (option === 'Only downloadable') {
    selectedOptions.downloadable = true;
  } else {
    selectedOptions.downloadable = false;
  }

  refreshFilters();
}

function toggleReadable(option: string) {
  if (option === 'Only readable') {
    selectedOptions.readable = true;
  } else {
    selectedOptions.readable = false;
  }

  refreshFilters();
}

const filterGrid = ref<HTMLDivElement | null>(null);

const getItemsWidths = (items: string[]): number[] => {
  const fontFamily = "Avenir, Helvetica, Arial, sans-serif";
  return items.map(item => {
    const labelWidth = calculateTextWidth(item, 16, fontFamily);
    const iconOffset = 45;  // Assuming an icon width/offset for each item
    return labelWidth + iconOffset;
  });
}

const adjustFilterGrid = () => {
  if (filterGrid.value) {
    const grid = filterGrid.value as HTMLDivElement;

    const allItems = [...selectedOptions.subjects, ...selectedOptions.languages];

    if (selectedOptions.downloadable) {
      allItems.push('downloadable');
    }

    if (selectedOptions.readable) {
      allItems.push('readable');
    }

    // Getting supposed width of each element to find out how many can fit
    const elementsWidth = getItemsWidths(allItems);

    const containerWidth = grid.offsetWidth;
    // Taking padding into consideration so that elements don't get smaller than they are
    const columnElementPadding = 15;

    const itemsPerRow = Math.max(1, Math.floor(containerWidth / (Math.max(...elementsWidth) + columnElementPadding)));

    const rowOffsets: string[] = [];

    for (let i = 0; i < allItems.length; i++) {
      const isOddRow = Math.floor(i / itemsPerRow) % 2 === 1;
      rowOffsets.push(isOddRow ? '20px' : '0px');
    }

    allItems.forEach((category, index) => {
      const row = Math.floor(index / itemsPerRow);
      const column = index % itemsPerRow;
      const item = grid.children[index] as HTMLElement;

      if (item) {
        item.style.gridRow = `${row + 1}`;
        item.style.gridColumn = `${column + 1}`;
        item.style.transform = `translateX(${rowOffsets[index]})`; // Offset applied to make rows stand out
      }
    });
  }
};

onMounted(() => {
  fetchOptions();

  if (!loading.value) {
    adjustFilterGrid();
  }

  nextTick(() => {
    adjustFilterGrid();
  });

  window.addEventListener('resize', adjustFilterGrid);
});

watch(selectedOptions.subjects, async () => {
    await nextTick();
    adjustFilterGrid();
  },
  { deep: true }
);

watch(selectedOptions.languages, async () => {
    await nextTick();
    adjustFilterGrid();
  },
  { deep: true }
);

onBeforeUnmount(() => {
  window.removeEventListener('resize', adjustFilterGrid);
});
</script>

<template>
  <form class="filter-form" @submit.prevent="submitOptions">
      <div class="filter-row applied-margin applied-shrink">
        <div class="filter-cell">
          <input-selector 
            selector-type="picker"
            label-text="Add Categories" 
            :options="categories"
            placeholder="Choose category" 
            @select-option="addCategory"
          />
          <icon-button icon-type="reset" @click="resetCategories" />
        </div>
        <div class="filter-cell">
          <input-selector 
            selector-type="picker"
            label-text="Language" 
            :options="languages"
            placeholder="Choose language" 
            @select-option="addLanguage"
          />
          <icon-button icon-type="reset" @click="resetLanguages" />
        </div>
      </div>
      <div class="filter-row applied-shrink">
        <div class="filter-cell">
          <input-selector
            selector-type="selector"
            label-text="Downloadable" 
            :options="downloadability"
            placeholder="Choose access" 
            @select-option="toggleDownloadable"
          />  
        </div>
        <div class="filter-cell">
          <input-selector 
            selector-type="selector"
            label-text="Read access" 
            :options="readablility"
            placeholder="Choose access" 
            @select-option="toggleReadable"
          />
        </div>
      </div>
  </form>
  <div class="heading-row">
    <div class="filters-view" ref="filterGrid">
      <book-filter
        v-if="selectedOptions.downloadable"
        :filter-value="'downloadable'"
        :deleteEnabled="false"
        :color="'#19c224'"
      />
      <book-filter
        v-if="selectedOptions.readable"
        :filter-value="'readable'"
        :deleteEnabled="false"
        :color="'#cc9e1f'"
      />
      <book-filter 
        v-for="language in selectedOptions.languages" v-bind:key="language"
        :filter-value="language"
        :deleteEnabled="true"
        :color="'#f57886'"
        @deleted-filter="deleteLanguage"
      />
      <book-filter 
        v-for="category in selectedOptions.subjects" v-bind:key="category"
        :filter-value="category"
        :deleteEnabled="true"
        @deleted-filter="deleteCategory"
      />
    </div>
  </div>
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

.filters-view {
  width: 100%;
  display: grid;
  justify-content: start;
  gap: 15px;
  padding: 15px;
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
