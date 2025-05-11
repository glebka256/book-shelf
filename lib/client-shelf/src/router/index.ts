import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import FavoritesView from "@/views/FavoritesView.vue";

import SearchView from "@/views/search/SearchView.vue";
import DownloadView from "@/views/search/DownloadView.vue";

import AccountView from "@/views/AccountView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import LogoutView from "@/views/auth/LogoutView.vue";

import AboutView from "@/views/AboutView.vue";

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
    path: "/auth/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/auth/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/auth/logout",
    name: "logout",
    component: LogoutView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
