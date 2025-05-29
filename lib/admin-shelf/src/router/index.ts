import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes } from './routes/auth'
import { homeRoutes } from './routes/home'
import { aboutRoutes } from './routes/about'
import { storageRoutes } from './routes/storage'
import { sourcesRoutes } from './routes/sources'
import { usersRoutes } from './routes/users'
import { statRoutes } from './routes/stat'
import { profileRoutes } from './routes/profile'
import { authGuard } from './guards'

const routes = [
  ...homeRoutes,
  ...aboutRoutes,
  ...authRoutes,
  ...profileRoutes,
  ...storageRoutes,
  ...sourcesRoutes,
  ...usersRoutes,
  ...statRoutes
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(authGuard)

export default router