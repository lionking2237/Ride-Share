<template>
  <v-app-bar app dark color="green">
    <router-link style="text-decoration:none" v-bind:to="{ name: 'home-page' }">
      <v-toolbar-title class="white--text">
        The Warlock's Ride Share
      </v-toolbar-title>
    </router-link>

    <v-spacer/>

    <v-btn text v-bind:to="{ name: 'locations' }">Locations</v-btn>
    <v-btn text v-bind:to="{name:'rides'}">Rides</v-btn>
    <v-btn text v-bind:to="{name:'vehicleslist'}">Vehicles List</v-btn>
    <v-btn text v-bind:to="{name:'vehicles'}"> Create Vehicles</v-btn>
    <v-btn text v-bind:to="{name:'drive-sign-up'}">Driver Sign Up</v-btn>
    <v-btn text v-bind:to="{name:'authorize'}">Authorize Driver</v-btn>
    <v-btn text v-bind:to="{name:'ride-sign-up'}">Ride Sign Up</v-btn>
    <v-btn text v-bind:to="{name:'applyrideshare'}">Apply for Ride Share</v-btn>
  </v-app-bar>
</template>

<script>
export default {
};
</script>