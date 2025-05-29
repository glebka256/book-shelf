import { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/home-page/HomeView.vue'

export const homeRoutes: RouteRecordRaw[] = [
    { path: '/', name: 'home', component: HomeView }
]