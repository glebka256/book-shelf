import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SearchView from "@/views/SearchView.vue";
import DownloadView from "@/views/DownloadView.vue";
import FavoritesView from "@/views/FavoritesView.vue";
import AccountView from "@/views/AccountView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import LogoutView from "@/views/LogoutView.vue";
import AboutView from "../views/AboutView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/search",
    name: "search",
    component: SearchView
  },
  {
    path: "/search/downloadable",
    name: "downloadable",
    component: DownloadView
  },
  {
    path: "/favorites",
    name: "favorites",
    component: FavoritesView
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/account",
    name: "account",
    component: AccountView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/logout",
    name: "logout",
    component: LogoutView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
