import { RouteRecordRaw } from 'vue-router'
import AboutView from '@/views/aboutus-page/AboutView.vue'

export const aboutRoutes: RouteRecordRaw[] = [
    { path: '/aboutus', name: 'aboutus', component: AboutView }
]