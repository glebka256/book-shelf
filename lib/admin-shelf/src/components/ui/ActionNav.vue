<script setup lang="ts">
import { defineProps, PropType, defineEmits, computed } from "vue";

interface NavigationTab {
  id: string,
  name: string
}

const props = defineProps({
  tabs: {
    type: Array as PropType<NavigationTab[]>,
    required: true
  },
  activeTab: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: false,
    default: ""
  },
});

const emit = defineEmits(['select-tab']);

const currentTab = computed(() => props.activeTab);

const selectTab = (tabId: string) => {
  emit("select-tab", tabId);
}
</script>

<template>
   <div class="action-nav">
    <div class="nav-container">
      <h2 class="title">{{ props.title}}</h2>
      <ul class="nav-list">
        <li
          v-for="tab in props.tabs"
          :key="tab.id"
          class="nav-item"
          :class="{ active: currentTab === tab.id }"
          @click="selectTab(tab.id)"
        >
          {{ tab.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.action-nav {
  color: $main-darker-bgcolor;
  background-color: #918ff1;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  box-shadow: $light-shadow;

  .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 1.25rem;
      font-weight: $med-thick;
      color: $main-thick-font;
    }

    .nav-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 1rem;
    }

    .nav-item {
      padding: 0.5rem 1rem;
      cursor: pointer;
      border-radius: 4px;
      font-weight: $med-weight;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: #e8e8e8;
      }
      
      &.active {
        background-color: #4a86e8;
        color: white;
      }
    }
  }
}
</style>