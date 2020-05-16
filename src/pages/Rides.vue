<template>
    <div>
        <v-btn text v-bind:to="{name:'add-rides'}">Add Ride</v-btn>
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
                    <td><v-btn color="primary" dark class="mb-2" v-on:click="showDialog(item)">Update</v-btn></td>
                </tr>
            </template>
        </v-data-table>
        <v-dialog v-model="dialogVisible" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field  v-model="editedItem.time" label="Time"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field  v-model="editedItem.date" label="Date"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field  v-model="editedItem.distance" label="Distance(in Miles)"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field  v-model="editedItem.fuelPrice" label="Fuel Price($)"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field  v-model="editedItem.fee" label="Fee($)"></v-text-field>
                            </v-col>
                            <v-overflow-btn

                                    v-model="editedItem.fromLocationId"
                                    :items="locations"
                                    label="Origin"
                            ></v-overflow-btn>
                            <v-col cols="12" sm="6" md="4">
                                <v-overflow-btn

                                        v-model="editedItem.toLocationId"
                                        :items="locations"
                                        label="Destination"
                                ></v-overflow-btn>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-overflow-btn

                                v-model="editedItem.vehicleId"
                                :items="vehicles"
                                label="Vehicle License Plate"
                        ></v-overflow-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text v-on:click="save">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar.show">
            {{ snackbar.text }}
            <v-btn color="blue" text @click="snackbar.show = false">
                Close
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    export default {
        name: "Rides",
        data: function() {
            return {
                formTitle:'Update Vehicle',
                rules:{
                    required: [(val) => val.length > 0|| (val)>0 || "Required"],
                },
                locations: [],
                vehicles: [],
                rideUpdated: false,
                dialogVisible: false,
                snackbar: {
                    show: false,
                    text: ""
                },
                editedItem: {
                    date: '',
                    time: '',
                    distance: '',
                    fuelPrice: 0,
                    fee: 0,
                    fromLocationId: '',
                    toLocationId: '',
                    vehicleId:'',
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
                rides: [],
            }
        },
        methods:{
            showDialog(item) {
                this.editedItem = item;
                this.dialogVisible = true;
            },
            showSnackbar(text) {
                this.snackbar.text = text;
                this.snackbar.show = true;
            },
            save: function(){
                this.rideUpdated = false;
                this.$axios.patch(`/rides/${this.editedItem.id}`, {
                    id: this.editedItem.id,
                    date: this.editedItem.date,
                    time: this.editedItem.time,
                    distance: this.editedItem.distance,
                    fuelPrice:this.editedItem.fuelPrice,
                    fee: this.editedItem.fee,
                    vehicleId: this.editedItem.vehicleId,
                    fromLocationId: this.editedItem.fromLocationId,
                    toLocationId:this.editedItem.toLocationId,
                }).then((result) => {
                    // Based on whether things worked or not, show the
                    // appropriate dialog.
                    if (result.data.ok) {
                        this.showSnackbar("Success " + result.data.msge);
                        this.rideUpdated = true;
                        this.dialogVisible = false;
                    } else {
                        this.showSnackbar("Sorry " + result.data.msge);
                    }
                })
                    .catch((err) => this.showDialog("Failed", err));

            },
        },
        mounted: function () {
            this.$axios.get("/rides").then(response => {
                console.log("RESPONSE", response);
                this.rides = response.data.map(ride =>({
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