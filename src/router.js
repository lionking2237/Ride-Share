import Vue from "vue";
import Router from "vue-router";

import Home from "./pages/Home.vue";
import Locations from "./pages/Locations";
import Vehicles from "./pages/Vehicles";
import Rides from "./pages/Rides";
import VehiclesList from "./pages/VehiclesList"
import Authorize from "./pages/Authorize"
import ApplyRideShare from "./pages/ApplyRideShare"
import AddRides from "./pages/AddRides";
import RideSignUp from "./pages/RideSignUp";
import DriveSignUp from "./pages/DriveSignUp";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { name: "home-page", path: "/", component: Home },
    { name: "locations", path: "/locations", component: Locations },
    { name: "vehicles", path: "/vehicles", component: Vehicles },
    { name: "rides", path: "/rides", component: Rides },
    { name: "vehicleslist", path: "/vehicleslist", component: VehiclesList},
    { name: "authorize", path: "/authorize", component: Authorize },
    { name: "applyrideshare", path: "/apply-ride-share", component: ApplyRideShare },
    { name: "add-rides", path: "/add-rides", component: AddRides },
    { name: "ride-sign-up", path: "/ride-sign-up", component: RideSignUp },
    { name: "drive-sign-up", path: "/drive-sign-up", component: DriveSignUp }
  ]
});