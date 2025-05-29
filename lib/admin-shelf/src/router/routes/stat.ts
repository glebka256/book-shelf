import { RouteRecordRaw } from 'vue-router'
import StatManager from '@/views/stat-manager/StatManager.vue'

export const statRoutes: RouteRecordRaw[] = [
    { path: '/stat-manager', name: 'stat-manager', component: StatManager }
]