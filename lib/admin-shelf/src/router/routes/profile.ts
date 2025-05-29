import { RouteRecordRaw } from 'vue-router'
import ProfileManager from '@/views/profile-manager/ProfileManager.vue'

export const profileRoutes: RouteRecordRaw[] = [
    { path: '/profile', name: 'profile', component: ProfileManager }
]