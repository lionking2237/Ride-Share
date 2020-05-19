<template>
    <v-container>
        <div><h4 class="display-1">Sign Up For a Ride</h4></div>
        <div>
            <v-form v-model="valid">
                <v-overflow-btn
                        v-bind:rules="rules.required"
                        v-model="newAuthorize.passengerId"
                        :items="passengers"
                        label="Passengers">
                </v-overflow-btn>
                <v-overflow-btn
                        v-bind:rules="rules.required"
                        v-model="newAuthorize.rideId"
                        :items="rides"
                        label="Rides">
                </v-overflow-btn>
                <v-btn color="green"
                    class="white--text" v-bind:disabled="!valid" v-on:click="handleSubmit"
                >Join Ride
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
        name: "RideSignUp",
        data: function() {
            return {
                valid: false,
                rules:{
                    required: [(val) => val.length > 0|| (val)>0 || "Required"],
                },
                newAuthorize: {
                    passengerId: "",
                    rideId: "",
                },
                rides:[],
                dialogHeader: "<no dialogHeader>",
                dialogText: "<no dialogText>",
                dialogVisible: false,
                authorizationCreated:false,
                passengers: [],
            }
        },
        methods:{
            handleSubmit: function() {
                this.authorizationCreated = false;
                this.$axios.post("/passengerSignUp", {
                    passengerId: this.newAuthorize.passengerId,
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
                    this.$router.push({ name: "home-page" });
                }
            },
            showDialog: function (header, text) {
                this.dialogHeader = header;
                this.dialogText = text;
                this.dialogVisible = true;
            },
        },
        mounted: function () {
            this.$axios.get("/rides").then(response => {
                console.log("RESPONSE", response);
                this.rides = response.data.map(ride =>{
                    return{
                        text: ride.fromLocations.name + " to " + ride.toLocations.name,
                        value: ride.id,
                    }
                });
            });
            this.$axios.get("/passengers").then(response => {
                console.log("RESPONSE", response);
                this.passengers = response.data.map(entry => {
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