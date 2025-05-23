<script setup lang="ts">
import { defineProps, PropType } from "vue";
import LogoImage from "@/../../component-lib/src/components/common/LogoImage.vue";
<<<<<<< HEAD

interface NavigationRoute {
  link: string,
  faIcon: string,
  text: string
}
=======
import { NavigationRoute } from "./appBar.types";
>>>>>>> 07dc98133e208b78c797650cc1ef9334c089bde0

const props = defineProps({
  navigationRoutes: {
    type: Array as PropType<NavigationRoute[]>,
    required: true
  },
  title: {
    type: String,
    required: false,
    default: undefined
  },
  logo: {
    type: Boolean,
    required: false,
    default: false
  },
  backgroundColor: {
    type: String,
    default: "#2d305e"
  },
  headingColor: {
    type: String,
    default: "#ffffff"
  },
  linkColor: {
    type: String,
    default: "#ffffff"
  },
  width: {
    type: String,
    default: "246px"
  },
  collapsedWidth: {
    type: String,
    default: "92px"
  }
});
</script>

<template>
 <div 
  class="app-bar"
  :style="{
    '--app-bar-bg': props.backgroundColor,
    '--app-bar-h2-color': props.headingColor,
    '--app-bar-link-color': props.linkColor,
    '--app-bar-width': props.width,
    '--app-bar-collapsed-width': props.collapsedWidth
  }"
>
  <nav>
    <ul>
      <LogoImage v-if=props.logo :width="80"/>
      <h2 v-if="props.title" id="brand-title">{{ props.title }}</h2>
      <li v-for="navigation in navigationRoutes" :key="navigation.text">
        <router-link :to="navigation.link">
          <i :class="navigation.faIcon"></i> <span class="router-link-text">{{ navigation.text }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
 </div>
</template>

<style scoped lang="scss">
.app-bar {
  width: var(--app-bar-width);
  height: 100vh;
  color: #ffffff;
  background-color: var(--app-bar-bg);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding: 1rem;
  border-radius: 0 10% 10% 0;
  transition: width 0.4s ease, padding 0.4s ease, border-radius 0.4s ease;
}

nav ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  transition: all 0.4s ease;

  h2 {
    color: var(--app-bar-h2-color);
  }
}

nav li {
  margin-bottom: 0.5rem;
  transition: margin 0.4s ease;

  a {
    color: var(--app-bar-link-color);
    text-decoration: none;
    font-size: 1.2rem;
    display: flex;
    flex-direction: row;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: padding 0.4s ease, background-color 0.4s ease;
  }

  a:hover {
    background-color: #9598d2;
  }

  i {
    // Use fixed width so that text is displayed in one neat line
    // Alternative would be to display text and icons in columns side by side
    width: 24px;
    margin-right: 0.75rem;
    transition: margin-right 0.4s ease, font-size 0.4s ease;
  }
}

@media (max-width: 1084px) {
  .app-bar {
    width: var(--app-bar-collapsed-width);
  }

  nav li a {
    justify-content: center;
    padding: 0.5rem;

    .router-link-text {
      display: none;
      pointer-events: none;
      transition: opacity 0.4s ease;
    }

    i {
      margin-right: 0;
      font-size: 1.5rem;
    }
  }
}
</style>