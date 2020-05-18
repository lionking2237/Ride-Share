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
               v-model="selectedPassenger"
               :items="passengers"
               label="Select a Passenger to find rides of">
           </v-overflow-btn>
           <v-btn v-on:click="updateCurrentPassenger">Select Passenger</v-btn>
       </div>
       <div>
           <v-overflow-btn
                   v-model="selectedDriver"
                   :items="drivers"
                   label="Select a Driver to find current rides for">
           </v-overflow-btn>
           <v-btn v-on:click="updateCurrentDriver">Select Driver</v-btn>
       </div>
       <v-spacer />
       <div><h4 class="display-1">View Selected Rides</h4></div>
       <div>
           <v-data-table :headers="headers" :items="rides">
               <template v-slot:item="{ item }">
                   <tr>
                       <td>{{ item.date }}</td>
                       <td>{{ item.time }}</td>
                       <td>{{ item.distance }}</td>
                       <td>{{ item.fuelPrice }}</td>
                       <td>{{ item.fee }}</td>
                       <td>{{ item.driver }}</td>
                       <td>{{ item.passenger }}</td>
                       <td>{{item.fromLocation}}</td>
                       <td>{{item.toLocation}}</td>
                       <td>{{item.vehicle}}</td>
                   </tr>
               </template>
           </v-data-table>
       </div>
   </v-container>
</template>

<script>
    export default {
        name: "ApplyRideShare",
        data: function() {
            return {
                dialogText:"",
                dialogVisible:false,
                passengerValid:false,
                driverValid:false,
                drivers: [],
                passengers:[],
                rides: [],
                dialogHeader:"",
                selectedPassenger: {},
                selectedDriver:{},
                rules:{
                    passengerRequired: [(val) => val.length > 0|| (val)>0 || "Required"],
                    driverRequired: [(val) => val.length > 0|| (val)>0 || "Required"],
                },
                headers: [
                    {text: "Date", value: "date"},
                    {text: "Time", value: "time"},
                    {text: "Distance", value: "distance"},
                    {text: "Fuel Price", value: "fuelPrice"},
                    {text: "Fee", value: "fee"},
                    {text: "Driver", value: "driver"},
                    {text: "Passenger", value: "passenger"},
                    {text: "From Location", value: "fromLocation"},
                    {text: "To Location", value: "toLocation"},
                    {text: "Vehicle License Plate", value: "vehicle"},

                ],
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
            updateCurrentPassenger: function(){
                this.$axios.get(`/passenger/${this.selectedPassenger.id}`, {
                }).then(response => {
                    console.log("RESPONSE", response);
                    this.rides = response.data.rides.map(ride =>({
                        id: ride.id,
                        date: ride.date.slice(0, 10),
                        time: ride.time,
                        distance: ride.distance,
                        fuelPrice: ride.fuelPrice,
                        fee: ride.fee,
                        driver: ride.drivers.map(driver => `${driver.firstName} ${driver.lastName} `),
                        passenger: ride.passengers.map(passenger => `${passenger.firstName} ${passenger.lastName}`),
                        fromLocation: ride.fromLocations.name,
                        toLocation: ride.toLocations.name,
                        vehicle: ride.vehicles.licenseNumber,
                    }));
                });
            },
            updateCurrentDriver: function(){
                this.$axios.get(`/driver/${this.selectedDriver.id}`, {
                }).then(response => {
                    console.log("RESPONSE", response);
                    this.rides = response.data.rides.map(ride =>({
                        id: ride.id,
                        date: ride.date.slice(0, 10),
                        time: ride.time,
                        distance: ride.distance,
                        fuelPrice: ride.fuelPrice,
                        fee: ride.fee,
                        driver: ride.drivers.map(driver => `${driver.firstName} ${driver.lastName} `),
                        passenger: ride.passengers.map(passenger => `${passenger.firstName} ${passenger.lastName}`),
                        fromLocation: ride.fromLocations.name,
                        toLocation: ride.toLocations.name,
                        vehicle: ride.vehicles.licenseNumber,
                    }));
                });
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
            this.$axios.get("/passengers").then(response => {
                console.log("RESPONSE", response);
                this.passengers = response.data.map(passenger => {
                    return{
                        text: passenger.firstName + " " + passenger.lastName,
                        value: passenger,
                    }
                })
            });
            this.$axios.get("/drivers").then(response => {
                console.log("RESPONSE", response);
                this.drivers = response.data.map(driver => {
                    return{
                        text: driver.firstName + " " + driver.lastName,
                        value: driver,
                    }
                })
            });

        }
    };


</script>

<style scoped>
</style>