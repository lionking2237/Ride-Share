<template>
    <v-container>
        <div><h4 class="display-1">Select a Ride to Drive For</h4></div>
        <div><h4 class="display-5">Please select a Driver first, then the Ride.</h4></div>
        <div>
            <v-form v-model="driverValid">
                <v-overflow-btn
                        v-bind:rules="rules.required"
                        v-model="newAuthorize.driverId"
                        :items="drivers"
                        label="Drivers">
                </v-overflow-btn>
                <v-btn color="green"
                    class="white--text" v-bind:disabled="!driverValid" v-on:click="findDriver"
                >Select Driver
                </v-btn>
            </v-form>
            <v-form v-model="rideValid">
                <v-overflow-btn
                        v-bind:rules="rules.required"
                        v-model="newAuthorize.rideId"
                        :items="rides"
                        label="Rides">
                </v-overflow-btn>
                <v-btn color="green"
                    class="white--text" v-bind:disabled="!rideValid" v-on:click="handleSubmit"
                >Drive for Ride
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
    </v-container>
</template>

<script>
    export default {
        name: "DriveSignUp",
        data: function() {
            return {
                driverValid: false,
                rideValid: false,
                rules:{
                    required: [(val) => val.length > 0|| (val)>0 || "Required"],
                },
                newAuthorize: {
                    driverId: "",
                    rideId: "",
                },
                rides:[],
                dialogHeader: "<no dialogHeader>",
                dialogText: "<no dialogText>",
                dialogVisible: false,
                authorizationCreated:false,
                drivers: [],
            }
        },
        methods:{
            findDriver: function() {
                this.$axios.get(`/driverRides/${this.newAuthorize.driverId}`, {
                }).then(response => {
                    console.log("RESPONSE", response);
                    this.rides = [];
                    response.data.vehicles.forEach((vehicle) =>
                        vehicle.rides.forEach((ride) =>
                            this.rides.push({
                                text: `${ride.fromLocations.name} to ${ride.toLocations.name}`,
                                value: ride.id,
                            })
                        )
                    );
                    console.log("RIDES", this.rides);
                });
            },
            handleSubmit: function() {
                this.authorizationCreated = false;
                this.$axios.post("/driverSignUp", {
                    driverId: this.newAuthorize.driverId,
                    rideId: this.newAuthorize.rideId,
                }).then(response => {
                    if (response.data.ok) {
                        this.showDialog("Success", response.data.msge);
                        this.authorizationCreated = true;
                    } else {
                        this.showDialog("Sorry", response.data.msge);
                    }
                })
                    .catch((err) => this.showDialog("Failed", err));
            },
            hideDialog: function () {
                this.dialogVisible = false;
                if (this.vehicleCreated) {
                    // Only navigate away from the sign-up page if we were successful.
                }
            },
            showDialog: function (header, text) {
                this.dialogHeader = header;
                this.dialogText = text;
                this.dialogVisible = true;
            },
        },
        mounted: function () {
            this.$axios.get("/drivers").then(response => {
                console.log("RESPONSE", response);
                this.drivers = response.data.map(entry => {
                    return {
                        text: entry.firstName + " " + entry.lastName,
                        value: entry.id
                    }
                })
            });
        }
    }
</script>

<style scoped>
</style>