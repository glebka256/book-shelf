<script setup lang="ts">
import LogoImage from "@/components/common/LogoImage.vue";

interface NavigationRoute {
  link: string,
  faIcon: string,
  text: string
}

const navigationRoutes: NavigationRoute[] = [
  { link: '/', faIcon: "fas fa-home",        text: "Home"                 },
  { link: '/', faIcon: "fas fa-database",    text: "Storage Manager"      },
  { link: '/', faIcon: "fas fa-layer-group", text: "Sources Manager"      },
  { link: '/', faIcon: "fas fa-chart-line",  text: "Statistics dashboard" },
  { link: '/', faIcon: "fas fa-users",       text: "Users dashboard"      },
]
</script>

<template>
 <div class="app-bar">
  <nav>
    <ul>
      <LogoImage :width="80"/>
      <h2 id="brand-title">Admin Shelf</h2>
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
  width: 238px;
  height: 100vh;
  color:#ffffff;
  background-color: #2d305e;
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
}

nav li {
  margin-bottom: 0.5rem;
  transition: margin 0.4s ease;

  a {
    color:#ffffff;
    text-decoration: none;
    font-size: 1.2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: padding 0.4s ease, background-color 0.4s ease;
  }

  a:hover {
    background-color: #9598d2;
  }

  i {
    margin-right: 0.75rem;
    transition: margin-right 0.4s ease, font-size 0.4s ease;
  }
}

@media (max-width: 1084px) {
  .app-bar {
    width: 92px;
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