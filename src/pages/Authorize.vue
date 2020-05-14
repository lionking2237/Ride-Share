<template>
   <v-container>
       <div><h4 class="display-1">Driver Authorization</h4></div>
       <div>
           <v-form v-model="valid">
               <v-overflow-btn
               v-bind:rules="rules.required"
               label="Driver">
               </v-overflow-btn>
               <v-overflow-btn
               v-bind:rules="rules.required"
               label="Vehicle">
               </v-overflow-btn>
               <v-btn v-bind:disabled="!valid" v-on:click="handleSubmit"
            >Add Vehicle
            </v-btn>
               </v-form>
       </div>
   </v-container>
</template>

<script>
    export default {
        name: "Authorize",
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