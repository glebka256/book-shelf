<script setup lang="ts">
import { ref, onMounted, reactive, defineEmits, nextTick, watch, onBeforeUnmount } from 'vue';
import InputSelector from '@/components/InputSelector.vue';
import IconButton from '@/components/IconButton.vue';
import BookFilter from '@/components/BookFilter.vue';
import { FilterOptions, FilterGenre, FilterQuery } from '@/types/Filter';
import baseInstance from '@/api/baseInstance';
import { calculateTextWidth } from '@/utils';

const emit = defineEmits(['filters-applied']);

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

function resetOptions() {
  selectedOptions.subjects = [],
  selectedOptions.languages = [],
  selectedOptions.downloadable = false,
  selectedOptions.readable = false

  loading.value = true;
  fetchOptions();
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

function addLanguage(language: string) {
  if (!selectedOptions.languages.includes(language)) {
    selectedOptions.languages.push(language);
  }
}

function toggleDownloadable(status: boolean) {
  selectedOptions.downloadable = status;
}

function toggleReadable(status: boolean) {
  selectedOptions.readable = status;
}

const filterGrid = ref<HTMLDivElement | null>(null);

const adjustFilterGrid = () => {
  if (filterGrid.value) {
    const grid = filterGrid.value as HTMLDivElement;

    // Getting supposed width of each element to find out how many can fit
    const fontFamily = "Avenir, Helvetica, Arial, sans-serif";
    const elementsWidth = selectedOptions.subjects.map(category => {
      const labelWidth = calculateTextWidth(category, 16, fontFamily);
      const iconOffset = 45;  // Assuming an icon width/offset for each item
      return labelWidth + iconOffset;
    });

    const containerWidth = grid.offsetWidth;
    // Taking padding into consideration so that elements don't get smaller than they are
    const columnElementPadding = 15;

    const itemsPerRow = Math.max(1, Math.floor(containerWidth / (Math.max(...elementsWidth) + columnElementPadding)));

    const rowOffsets: string[] = [];
    for (let i = 0; i < selectedOptions.subjects.length; i++) {
      const isOddRow = Math.floor(i / itemsPerRow) % 2 === 1;
      rowOffsets.push(isOddRow ? '20px' : '0px');
    }

    selectedOptions.subjects.forEach((category, index) => {
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

onBeforeUnmount(() => {
  window.removeEventListener('resize', adjustFilterGrid);
});
</script>

<template>
  <form class="filter-form" @submit.prevent="submitOptions">
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
            @select-option="addLanguage"
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
            @select-option="toggleDownloadable"
          />
          <icon-button icon-type="reset" />    
        </div>
        <div class="filter-cell">
          <input-selector 
            label-text="Read access" 
            :options="['Only readable']"
            placeholder="Choose access" 
            @select-option="toggleReadable"
          />
          <icon-button icon-type="reset" />
        </div>
      </div>
  </form>
  <div class="heading-row">
    <div class="filters-view" ref="filterGrid">
      <book-filter 
        v-for="category in selectedOptions.subjects" v-bind:key="category"
        :filter-value="category"
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
