<template>
   <v-container>
       <div><h4 class="display-1">Apply for Passenger or Driver</h4></div>
       <div>
           <v-form v-model="valid">
               <v-text-field
               v-bind:rules="rules.required"
               label="Passenger Name">
               </v-text-field>
               <v-btn v-bind:disabled="!valid" v-on:click="handleSubmit"
            >Add Passenger
            </v-btn>
               <v-text-field
               v-bind:rules="rules.required"
               label="Driver Name">
               </v-text-field>
               <v-btn v-bind:disabled="!valid" v-on:click="handleSubmit"
            >Add Driver
            </v-btn>
               </v-form>
       </div>
   </v-container>
</template>

<script>
    export default {
        name: "ApplyRideShare",
        data: function() {
            return {
                headers: [
                    {text: "Date", value: "date"},
                    {text: "Time", value: "time"},
                    {text: "Distance", value: "distance"},
                    {text: "Fuel Price", value: "fuelPrice"},
                    {text: "Fee", value: "fee"},
                ],
                rides: [],
                rules:{
                    licenceNum:[(val) => val.length > 0 && val.length < 16],
                    required: [(val) => val.length > 0|| (val)>0 || "Required"],
                },
            }
        },
        handleSubmit: function() {
            return "test";
        },
        mounted: function () {
            this.$axios.get("/rides").then(response => {
                console.log("RESPONSE", response);
                this.rides = response.data;
            })
        }
    }
</script>

<style scoped>
</style>