<script setup lang="ts">
import { defineProps, PropType, ref } from 'vue';
import { AppSection, SectionRoute } from '../aboutus.types';

const props = defineProps({
  section: {
    type: Object as PropType<AppSection>,
    requied: true
  }
});

// Track expanded state for each section route
const expandedRoutes = ref<Set<string>>(new Set());

const toggleRoute = (routePath: string) => {
  if (expandedRoutes.value.has(routePath)) {
    expandedRoutes.value.delete(routePath);
  } else {
    expandedRoutes.value.add(routePath);
  }
};

const isExpanded = (routePath: string) => {
  return expandedRoutes.value.has(routePath);
};

const hasChildren = (route: SectionRoute) => {
  return route.childRoutes && route.childRoutes.length > 0;
};
</script>

<template>
  <ul class="route-list" v-if="props.section">
    <li v-for="route in props.section.routes" :key="route.path" class="route-item">
      <div class="route-main">
        <!-- Dropdown arrow button -->
        <button v-if="hasChildren(route)" @click="toggleRoute(route.path)" class="expand-button"
          :class="{ 'expanded': isExpanded(route.path) }" :aria-expanded="isExpanded(route.path)"
          :aria-label="`${isExpanded(route.path) ? 'Collapse' : 'Expand'} ${route.name} section`">
          <svg class="expand-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>

        <div class="route-content">
          <a :href="route.path" class="route-link">{{ route.name }}</a>
          <span v-if="route.description" class="route-description">{{ route.description }}</span>
        </div>
      </div>

      <!-- Child routes -->
      <ul v-if="hasChildren(route) && isExpanded(route.path)" class="child-route-list">
        <li v-for="childRoute in route.childRoutes" :key="childRoute.path" class="child-route-item">
          <a :href="childRoute.path" class="child-route-link">{{ childRoute.name }}</a>
          <span v-if="childRoute.description" class="child-route-description">{{ childRoute.description
          }}</span>
        </li>
      </ul>
    </li>
  </ul>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.route-list {
  list-style: none;
  padding: 0;
  margin: 0;

  .route-item {
    margin-bottom: 0.75rem;
    position: relative;

    .route-main {
      display: flex;
      align-items: flex-start;
      text-align: left;
      gap: 0.5rem;
      padding-left: 1rem;
      position: relative;

      &::before {
        content: '•';
        position: absolute;
        left: 0;
        top: 0;
        color: $main-color;
        font-weight: bold;
        font-size: 1.2rem;
        line-height: 1.2;
      }

      .expand-button {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        color: $main-color;
        transition: transform 0.2s ease;
        margin-top: 1px;

        &:hover {
          color: $btn-bgcolor;
        }

        &:focus {
          outline: 2px solid $btn-bgcolor;
          outline-offset: 2px;
          border-radius: 2px;
        }

        &.expanded {
          transform: rotate(90deg);
        }

        .expand-icon {
          width: 16px;
          height: 16px;
        }
      }

      .route-content {
        flex: 1;
        min-width: 0;

        .route-link {
          color: $tag-color;
          text-decoration: none;
          font-weight: $med-weight;
          font-size: 0.95rem;
          display: block;
          margin-bottom: 0.2rem;

          &:hover {
            color: $btn-bgcolor;
            text-decoration: underline;
          }
        }

        .route-description {
          font-size: 0.85rem;
          color: $sec-thick-font;
          line-height: 1.4;
          display: block;
        }
      }
    }

    .child-route-list {
      list-style: none;
      padding: 0;
      margin: 0.5rem 0 0 2rem;
      border-left: 2px solid $main-border-color;
      padding-left: 1rem;

      .child-route-item {
        text-align: left;
        margin-bottom: 0.5rem;
        position: relative;
        padding-left: 1rem;

        &::before {
          content: '└';
          position: absolute;
          left: 0;
          top: 0;
          color: $main-color;
          font-weight: normal;
          font-size: 0.9rem;
          line-height: 1.2;
        }

        .child-route-link {
          color: $tag-color;
          text-decoration: none;
          font-weight: $med-weight;
          font-size: 0.9rem;
          display: block;
          margin-bottom: 0.1rem;

          &:hover {
            color: $btn-bgcolor;
            text-decoration: underline;
          }
        }

        .child-route-description {
          font-size: 0.8rem;
          color: $sec-thick-font;
          line-height: 1.3;
          display: block;
        }
      }
    }
  }
}
</style>