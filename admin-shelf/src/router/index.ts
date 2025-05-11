import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import StorageManager from '@/views/storage-manager/StorageManager.vue'
import SourcesManager from '@/views/sources-manager/SourcesManager.vue'
import UsersManager from '@/views/users-manager/UsersManager.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: "/storage-manager",
    name: 'storage-manager',
    component: StorageManager
  },
  {
    path: "/sources-manager",
    name: 'sources-manager',
    component: SourcesManager
  },
  {
    path: "/users-manager",
    name: 'users-manager',
    component: UsersManager
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
