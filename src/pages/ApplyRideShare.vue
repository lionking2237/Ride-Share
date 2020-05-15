<template>
   <v-container>
       <div><h4 class="display-1">Apply for Passenger or Driver</h4></div>
       <div>
           <v-form v-model="valid">
               <v-text-field
               v-model="newPassenger.firstName"
               v-bind:rules="rules.required"
               label="Passenger First Name">
               </v-text-field>
               <v-text-field
               v-model="newPassenger.lastName"
               v-bind:rules="rules.required"
               label="Passenger Last Name">
               </v-text-field>
               <v-text-field
               v-model="newPassenger.phone"
               v-bind:rules="rules.required"
               label="Passenger Cellphone Number">
               </v-text-field>
               <v-btn v-bind:disabled="!valid" v-on:click="createPassenger"
            >Add Passenger
            </v-btn>
               <v-text-field
               v-model="newDriver.firstName"
               v-bind:rules="rules.required"
               label="Driver First Name">
               </v-text-field>
               <v-text-field
               v-model="newDriver.lastName"
               v-bind:rules="rules.required"
               label="Driver Last Name">
               </v-text-field>
               <v-text-field
               v-model="newDriver.phone"
               v-bind:rules="rules.required"
               label="Driver Cellphone Number">
               </v-text-field>
               <v-text-field
               v-model="newDriver.licenseNumber"
               v-bind:rules="rules.required"
               label="Driver License Number">
               </v-text-field>
               <v-btn v-bind:disabled="!valid" v-on:click="createDriver"
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
                rules:{
                    required: [(val) => val.length > 0|| (val)>0 || "Required"],
                },
                newPassenger: [
                    firstName: "",
                    lastName: "",
                    phone: "",
                ],
                newDriver: [
                    firstName: "",
                    lastName: "",
                    phone: "",
                    licenseNumber: "",
                ]
                rules:{
                    licenceNum:[(val) => val.length > 0 && val.length < 16],
                    required: [(val) => val.length > 0|| (val)>0 || "Required"],
                },
            }
        },
        methods: {
            createPassenger: function() {
                this.$axios.post("/passengers", {
                    firstName: this.newPassenger.firstName,
                    lastName: this.newPassenger.lastName,
                    phone: this.newPassenger.phone,
                }).then((result) => {
                        // Based on whether things worked or not, show the
                        // appropriate dialog.
                        if (result.data.ok) {
                            this.showDialog("Success", result.data.msge);
                        } else {
                            this.showDialog("Sorry", result.data.msge);
                        }
                    }).catch((err) => this.showDialog("Failed", err));
            },
            createDriver: function() {
                this.$axios.post("/drivers", {
                    firstName: this.newDriver.firstName,
                    lastName: this.newDriver.lastName,
                    phone: this.newDriver.phone,
                    licenseNumber: this.newDriver.licenseNumber,
                }).then((result) => {
                        // Based on whether things worked or not, show the
                        // appropriate dialog.
                        if (result.data.ok) {
                            this.showDialog("Success", result.data.msge);
                        } else {
                            this.showDialog("Sorry", result.data.msge);
                        }
                    }).catch((err) => this.showDialog("Failed", err));
            },
        },

        
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