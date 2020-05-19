<template>
    <div>
        <v-form v-model="valid">
            <v-text-field
                    v-model="newRide.date"
                    v-bind:rules="rules.required"
                    label="YYYY-MM-DD(Date)">
            </v-text-field>
            <v-text-field
                    v-model="newRide.time"
                    v-bind:rules="rules.required"
                    label="HH:MM:SS(Military Time)">
            </v-text-field>
            <v-text-field
                    v-model="newRide.distance"
                    v-bind:rules="rules.required"
                    label="Distance(in Miles)">
            </v-text-field>
            <v-text-field
                    v-model="newRide.fuelPrice"
                    v-bind:rules="rules.required"
                    label="Fuel Price($)">
            </v-text-field>
            <v-text-field
                    v-model="newRide.fee"
                    v-bind:rules="rules.required"
                    label="Fee($)">
            </v-text-field>
            <v-overflow-btn
                    v-bind:rules="rules.required"
                    v-model="newRide.vehicleId"
                    :items="vehicles"
                    label="Vehicle License Plate"
            ></v-overflow-btn>
            <v-overflow-btn
                    v-bind:rules="rules.required"
                    v-model="newRide.fromLocationId"
                    :items="locations"
                    label="Origin"
            ></v-overflow-btn>
            <v-overflow-btn
                    v-bind:rules="rules.required"
                    v-model="newRide.toLocationId"
                    :items="locations"
                    label="Destination"
            ></v-overflow-btn>
            <v-btn color="green"
                    class="white--text"
                    v-bind:disabled="!valid" v-on:click="handleSubmit"
            >Add Ride
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
                        <v-btn color="green"
                    class="white--text" text v-on:click="hideDialog">Okay</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AddRides",
        data: function(){
            return{
                dialog: false, //Opens the form
                rules:{
                    required: [(val) => val.length > 0|| (val)>0 || "Required"],
                },
                valid: false,
                rideCreated: false,
                newRide: {
                    date: "",
                    time: "",
                    distance: "",
                    fuelPrice: "",
                    fee: "",
                    vehicleId:"",
                    fromLocationId:"",
                    toLocationId:"",
                },
                dialogHeader: "<no dialogHeader>",
                dialogText: "<no dialogText>",
                dialogVisible: false,
                locations: [],
                vehicles: [],
            }
        },
        methods: {
            handleSubmit: function(){
                this.vehicleCreated = false;
                this.$axios
                    .post("/rides", {
                        date: this.newRide.date,
                        time: this.newRide.time,
                        distance: parseInt(this.newRide.distance),
                        fuelPrice: parseInt(this.newRide.fuelPrice),
                        fee: parseInt(this.newRide.fee),
                        fromLocationId: this.newRide.fromLocationId,
                        toLocationId: this.newRide.toLocationId,
                        vehicleId: this.newRide.vehicleId,
                    })
                    .then((result) => {
                        // Based on whether things worked or not, show the
                        // appropriate dialog.
                        if (result.data.ok) {
                            this.showDialog("Success", result.data.msge);
                            this.vehicleCreated = true;
                        } else {
                            this.showDialog("Sorry", result.data.msge);
                        }
                    })
                    .catch((err) => this.showDialog("Failed", err));
            },
            showDialog: function (header, text) {
                this.dialogHeader = header;
                this.dialogText = text;
                this.dialogVisible = true;
            },
            hideDialog: function () {
                this.dialogVisible = false;
                if (this.vehicleCreated) {
                    // Only navigate away from the sign-up page if we were successful.
                    this.$router.push({ name: "home-page" });
                }
            },
        },
        mounted: function () {
            this.$axios.get("/locations").then(response => {
                console.log("RESPONSE", response);
                this.locations = response.data.map(entry => {
                    return {
                        text: entry.name,
                        value: entry.id
                    }
                })
            });
            this.$axios.get("/vehicleslist").then(response => {
                console.log("RESPONSE", response);
                this.vehicles = response.data.map(entry => {
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