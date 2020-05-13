import Vue from "vue";
import Router from "vue-router";

import Home from "./pages/Home.vue";
import About from "./pages/About.vue";
import Locations from "./pages/Locations";
import Vehicles from "./pages/Vehicles";
import Rides from "./pages/Rides";
import VehiclesList from "./pages/VehiclesList"

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { name: "home-page", path: "/", component: Home },
    { name: "about-us", path: "/about-us", component: About },
    { name: "locations", path: "/locations", component: Locations },
    { name: "vehicles", path: "/vehicles", component: Vehicles },
    { name: "rides", path: "/rides", component: Rides },
    { name: "vehicleslist", path: "/vehicleslist", component: VehiclesList},
  ]
});