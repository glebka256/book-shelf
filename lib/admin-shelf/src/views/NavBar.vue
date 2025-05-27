<script setup lang="ts">
import { NavigationRoute } from "@/component-lib/layout/appBar.types";
import AppBar from "@/component-lib/AppBar.vue";

const navigationRoutes: NavigationRoute[] = [
  { link: '/',                faIcon: "fas fa-home",        text: "Home"                 },
  { link: '/profile',         faIcon: "fas fa-user",        text: "Profile"              },
  { link: '/storage-manager', faIcon: "fas fa-database",    text: "Storage Manager"      },
  { link: '/sources-manager', faIcon: "fas fa-layer-group", text: "Sources Manager"      },
  { link: '/stat-manager',    faIcon: "fas fa-chart-line",  text: "Statistics dashboard" },
  { link: '/users-manager',   faIcon: "fas fa-users",       text: "Users dashboard"      },
]
</script>

<template>
 <AppBar 
  title="Admin Shelf"
  :logo="true"
  :navigationRoutes="navigationRoutes"
 />
</template>

<style scoped lang="scss">
// No styles
</style>