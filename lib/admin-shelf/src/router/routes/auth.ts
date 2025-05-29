import { RouteRecordRaw } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import LogoutView from '@/views/auth/LogoutView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'

export const authRoutes: RouteRecordRaw[] = [
    { path: '/auth/login', name: 'login', component: LoginView },
    { path: '/auth/logout', name: 'logout', component: LogoutView },
    { path: '/auth/register', name: 'register', component: RegisterView }
]