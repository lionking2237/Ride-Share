<template>
    <v-container>
        <div>
        <h4 class="display-1">Vehicle Creation</h4>
        </div>
        <div>
        <v-form v-model="valid">
            <v-text-field
            v-model="newVehicle.make"
            v-bind:rules="rules.required"
            label="Make">
            </v-text-field>
            <v-text-field
                    v-model="newVehicle.model"
                    v-bind:rules="rules.required"
                    label="Model">
            </v-text-field>
            <v-text-field
                    v-model="newVehicle.color"
                    v-bind:rules="rules.required"
                    label="Color">
            </v-text-field>
            <v-text-field
                    v-model="newVehicle.capacity"
                    v-bind:rules="rules.required"
                    label="Capacity">
            </v-text-field>
            <v-text-field
                    v-model="newVehicle.mpg"
                    v-bind:rules="rules.required"
                    label="Miles Per Gallon">
            </v-text-field>
            <v-text-field
                    v-model="newVehicle.LicenseNumber"
                    v-bind:rules="rules.required"
                    label="License Plate Number">
            </v-text-field>
            <!--Don't know how to access the names of the Vehicle Types or States yet-->
            <v-overflow-btn
                    v-model="newVehicle.VehicleType"
                    :items="vehicleTypes"
                    label="Vehicle Types"
            ></v-overflow-btn>
            <v-overflow-btn
                    v-model="newVehicle.LicenseState"
                    :items="states"
                    label="States"
            ></v-overflow-btn>
            <v-btn v-bind:disabled="!valid" v-on:click="handleSubmit"
            >Add Vehicle
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
        name: "Vehicles",
        data: function(){
            return{
                rules:{
                    required: [(val) => val.length > 0 || "Required"],
                },
                valid: false,
                vehicleCreated: false,
                newVehicle: {
                    make: "",
                    model: "",
                    color: "",
                    capacity: "",
                    mpg:"",
                    LicenseState:"",
                    LicenseNumber:"",
                    VehicleType:"",
                },
                dialogHeader: "<no dialogHeader>",
                dialogText: "<no dialogText>",
                dialogVisible: false,
                vehicleTypes: [],
                typeNames: {value:'type'},
                states: [],
                headers:[{text:"Type",value:"type"}],
            }
        },
        methods:{
            handleSubmit: function(){
                this.vehicleCreated = false;
                this.$axios
                    .post("/vehicles", {
                        make: this.newVehicle.make,
                        model: this.newVehicle.model,
                        color: this.newVehicle.color,
                        capacity: this.newVehicle.capacity,
                        mpg: this.newVehicle.mpg,
                        LicenseState: this.newVehicle.LicenseState,
                        LicenseNumber: this.newVehicle.LicenseNumber,
                        VehicleType: this.newVehicle.VehicleType,
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
            this.$axios.get("/vehicle-types").then(response => {
                console.log("RESPONSE", response);
                this.vehicleTypes = response.data.map(entry => {
                    return {
                        text: entry.type,
                        value: entry.id
                    }
                })
            });
            this.$axios.get("/states").then(response => {
                console.log("RESPONSE", response);
                this.states = response.data.map(entry => {
                    return {
                        text: entry.abbreviation,
                        value: entry.abbreviation
                    }
                })
            });
        }
    }
</script>

<style scoped>
</style>