import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: ""
    },
    {
      path: "/login",
      name: "Login Page",
      beforeEnter(to, from, next) {
        if (localStorage.getItem("access_token")) {
          router.push("/");
        } else {
          next();
        }
      },
      component: LoginPage
    },
    {
      path: "/register",
      name: "Register Page",
      beforeEnter(to, from, next) {
        if (localStorage.getItem("access_token")) {
          router.push("/");
        } else {
          next();
        }
      },
      component: RegisterPage
    },
  ],
});

export default router;
