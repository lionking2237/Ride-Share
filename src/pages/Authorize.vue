<template>
   <v-container>
       <div><h4 class="display-1">Driver Authorization</h4></div>
       <div>
           <v-form v-model="valid">
               <v-overflow-btn
               v-bind:rules="rules.required"
               v-model="newAuthorize.driverId"
               :items="driverIds"
               label="Driver">
               </v-overflow-btn>
               <v-overflow-btn
               v-bind:rules="rules.required"
               v-model="newAuthorize.vehicleId"
               :items="vehicleIds"
               label="Vehicle">
               </v-overflow-btn>
               <v-btn v-bind:disabled="!valid" v-on:click="handleSubmit"
            >Add Authorization
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
                rules:{
                    required: [(val) => val.length > 0|| (val)>0 || "Required"],
                },
                newAuthorize: {
                    driverId: "",
                    vehicleId: "",
                },
                driverIds: [],
                vehicleIds: [],

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
            this.$axios.get("/drivers").then(response => {
                console.log("RESPONSE", response);
                this.driverIds = response.data.map(entry => {
                    return {
                        text: entry.licenseNumber,
                        value: entry.id
                    }
                })
            });
            this.$axios.get("/vehicleslist").then(response => {
                console.log("RESPONSE", response);
                this.vehicleIds = response.data.map(entry => {
                    return {
                        text: entry.licenseNumber,
                        value: entry.id
                    }
                })
            });
        }
    }
</script>

<style scoped>
</style>