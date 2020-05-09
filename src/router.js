import Vue from "vue";
import Router from "vue-router";

import Home from "./pages/Home.vue";
import About from "./pages/About.vue";
import Locations from "./pages/Locations";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { name: "home-page", path: "/", component: Home },
    { name: "about-us", path: "/about-us", component: About },
    { name: "locations", path: "/locations", component: Locations }
  ]
});
