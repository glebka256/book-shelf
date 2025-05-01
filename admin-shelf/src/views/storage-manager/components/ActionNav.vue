<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";

const props = defineProps({
  activeTab: {
    type: String,
    required: false,
    default: 'books'
  }
});

const emit = defineEmits(['select-tab']);

const tabs = [
  { id: "books",  name: "Books"      },
  { id: "create", name: "Create"     },
  { id: "stats",  name: "Statistics" },
]

const currentTab = ref<string>(props.activeTab);

const selectTab = (tabId: string) => {
  currentTab.value = tabId;
  emit("select-tab", tabId);
}
</script>

<template>
 <div class="action-nav">
  <div class="nav-container">
    <h2 class="title">Storage Manager</h2>
    <ul class="nav-list">
      <li
        v-for="tab in tabs"
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
.action-nav {
  color: #ffffff;
  background-color: #918ff1;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
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
      font-weight: 500;
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