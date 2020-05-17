<template>
   <v-container>
       <div><h4 class="display-1">Apply for Passenger or Driver</h4></div>
       <div>
           <v-form v-model="passengerValid">
               <v-text-field
               v-model="newPassenger.firstName"
               v-bind:rules="rules.passengerRequired"
               label="Passenger First Name">
               </v-text-field>
               <v-text-field
               v-model="newPassenger.lastName"
               v-bind:rules="rules.passengerRequired"
               label="Passenger Last Name">
               </v-text-field>
               <v-text-field
               v-model="newPassenger.phone"
               v-bind:rules="rules.passengerRequired"
               label="Passenger Cellphone Number">
               </v-text-field>
               <v-btn v-bind:disabled="!passengerValid" v-on:click="createPassenger"
            >Add Passenger
            </v-btn>
           </v-form>
           <v-form v-model="driverValid">
               <v-text-field
               v-model="newDriver.firstName"
               v-bind:rules="rules.driverRequired"
               label="Driver First Name">
               </v-text-field>
               <v-text-field
               v-model="newDriver.lastName"
               v-bind:rules="rules.driverRequired"
               label="Driver Last Name">
               </v-text-field>
               <v-text-field
               v-model="newDriver.phone"
               v-bind:rules="rules.driverRequired"
               label="Driver Cellphone Number">
               </v-text-field>
               <v-text-field
               v-model="newDriver.licenseNumber"
               v-bind:rules="rules.driverRequired"
               label="Driver License Number">
               </v-text-field>
               <v-btn v-bind:disabled="!driverValid" v-on:click="createDriver"
            >Add Driver
            </v-btn>
           </v-form>
           <div class="text-xs-center">
               <v-dialog v-model="dialogVisible" width="500">
                   <v-card>
                       <v-card-title primary-title>
                           {{ dialogHeader }}
                       </v-card-title>

                       <v-card-text>
                           {{ dialogText }}
                       </v-card-text>

                       <v-divider></v-divider>

                       <v-card-actions>
                           <v-spacer></v-spacer>
                           <v-btn color="primary" text v-on:click="hideDialog">Okay</v-btn>
                       </v-card-actions>
                   </v-card>
               </v-dialog>
           </div>
       </div>
       <div>
           <v-overflow-btn
               v-model="selectedUser"
               :items="passengers"
               label="Select a Passenger to find rides of">
           </v-overflow-btn>
           <v-btn v-on:click="updateCurrentUser">Select Passenger</v-btn>
       </div>
       <div>
           <v-overflow-btn
                   v-model="selectedUser"
                   :items="driv"
                   label="Select a Driver to find current rides for">
           </v-overflow-btn>
           <v-btn v-on:click="updateCurrentUser">Select Driver</v-btn>
       </div>
   </v-container>
</template>

<script>
    export default {
        name: "ApplyRideShare",
        data: function() {
            return {
                dialogVisible:false,
                passengerValid:false,
                driverValid:false,
                passengers:[],
                rides: [],
                dialogHeader:"",
                selectedUser: {},
                selectedDriver:{},
                rules:{
                    passengerRequired: [(val) => val.length > 0|| (val)>0 || "Required"],
                    driverRequired: [(val) => val.length > 0|| (val)>0 || "Required"],
                },
                newPassenger: {
                    firstName: "",
                    lastName: "",
                    phone: "",
                },
                newDriver: {
                    firstName: "",
                    lastName: "",
                    phone: "",
                    licenseNumber: "",
                },
            }
        },
        methods: {
            updateCurrentUser: function(){
                this.$axios.post("/login", {
                    id: this.selectedUser.id
                }).then(response => {
                    this.showDialog(response.data.msge);
                    if (response.data.ok) {
                        this.$store.commit("logIn", response.data.details);
                    }
                });
                this.$axios.get("/Banana", {
                }).then(response => {
                    console.log("RESPONSE", response);
                    this.rides = response.data;
                });
            },
            updateCurrentDriver: function(){
                this.$root.currentUser=this.selectedDriver
            },

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
            showDialog: function (header, text) {
                this.dialogHeader = header;
                this.dialogText = text;
                this.dialogVisible = true;
            },

            // Invoked by the "Okay" button on the dialog; dismiss the dialog
            // and navigate to the home page.
            hideDialog: function () {
                this.dialogVisible = false;
                if (this.accountCreated) {
                    // Only navigate away from the sign-up page if we were successful.
                    this.$router.push({ name: "home-page" });
                }
            },
        },

        mounted: function () {
            this.$axios.get("/rides").then(response => {
                console.log("RESPONSE", response);
                this.rides = response.data;
            });
            this.$axios.get("/passengers").then(response => {
                console.log("RESPONSE", response);
                this.passengers = response.data.map(passenger => {
                    return{
                        text: passenger.firstName + " " + passenger.lastName,
                        value: passenger,
                    }
                })
            });

        }
    };


</script>

<style scoped>
</style>