import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import("../views/ContactView.vue"),
    },
    {
      path: "/entirePassage",
      name: "entirePassage",
      component: () => import("../views/EntirePassageView.vue"),
    },
    {
      path: "/memorize",
      name: "memorize",
      component: () => import("../views/MemorizeView.vue"),
    },
    {
      path: "/verify",
      name: "verify",
      component: () => import("../views/VerifySpeechView.vue"),
    },
    {
      path: "/repeat",
      name: "repeat",
      component: () => import("../views/RepeatView.vue"),
    },
    {
      path: "/finish",
      name: "finish",
      component: () => import("../views/FinishView.vue"),
    },
  ],
});

export default router;
