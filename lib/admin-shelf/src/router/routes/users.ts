import { RouteRecordRaw } from 'vue-router'
import UsersManager from '@/views/users-manager/UsersManager.vue'

export const usersRoutes: RouteRecordRaw[] = [
    { path: '/users-manager', name: 'users-manager', component: UsersManager }
]