import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import StorageManager from '@/views/storage-manager/StorageManager.vue'
import SourcesManager from '@/views/sources-manager/SourcesManager.vue'
import UsersManager from '@/views/users-manager/UsersManager.vue'
import ProfileManager from '@/views/profile-manager/ProfileManager.vue'
import LoginView from '@/views/auth/LoginView.vue'
import LogoutView from '@/views/auth/LogoutView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import { getLoginStatus } from '@/views/auth/auth.api'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileManager
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
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/logout',
    name: 'logout',
    component: LogoutView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const protectedRoutes = ["users-manager"];

router.beforeEach(async (to, from, next) => {
  if (protectedRoutes.includes(to.name as string)) {
    const isAuthorized = await getLoginStatus();
    if (isAuthorized) {
      next();
    } else {
      next({ name: 'login', query: { redirect: to.fullPath } });
    }
  } else {
    next();
  }
})

export default router