<template>
    <v-container>
        <div>
        <h4 class="display-1">Vehicle Creation</h4>
        </div>
        <div>
            <v-dialog
                    v-model="dialog"
                    width="500"
            >
                <template v-slot:activator="{ on }">
                    <v-btn 
                    color="green"
                    class="white--text"
                    v-on="on"
                    >
                        Add Vehicle Type
                    </v-btn>
                </template>

                <v-card>
                    <v-card-title
                            class="headline grey lighten-2"
                            primary-title
                    >
                        Vehicle Type
                    </v-card-title>

                    <v-card-text>
                        <v-text-field
                                v-bind:rules="rules.required"
                                v-model="newType.type"
                                label="Type"
                        ></v-text-field>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                                color="green"
                                class="white--text"
                                @click="createType"
                        >
                            Create
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
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
                    v-model="newVehicle.licenseNumber"
                    v-bind:rules="rules.licenceNum"
                    label="License Plate Number">
            </v-text-field>
            <v-overflow-btn
                    v-bind:rules="rules.required"
                    v-model="newVehicle.vehicleType"
                    :items="vehicleTypes"
                    label="Vehicle Types"
            ></v-overflow-btn>
            <v-overflow-btn
                    v-bind:rules="rules.required"
                    v-model="newVehicle.licenseState"
                    :items="states"
                    label="States"
            ></v-overflow-btn>
            <v-btn color="green"
                    class="white--text" 
                    v-bind:disabled="!valid" v-on:click="handleSubmit"
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
                dialog: false, //Opens the form
                rules:{
                    licenceNum:[(val) => val.length > 0 && val.length < 16],
                    required: [(val) => val.length > 0|| (val)>0 || "Required"],
                },
                valid: false,
                vehicleCreated: false,
                typeCreated: false,
                newType:{
                    type: ""
                },
                newVehicle: {
                    make: "",
                    model: "",
                    color: "",
                    capacity: "",
                    mpg: "",
                    licenseState:"",
                    licenseNumber:"",
                    vehicleType:"",
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
            createType: function() {
                this.dialog=false;
                this.typeCreated=false;
                this.$axios
                .post("/vehicle-types",{
                    type:this.newType.type,
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
            handleSubmit: function(){
                this.vehicleCreated = false;
                console.log(typeof this.newVehicle.make);
                console.log(typeof this.newVehicle.model);
                console.log(typeof this.newVehicle.color);
                console.log(typeof this.newVehicle.capacity);
                console.log(typeof this.newVehicle.mpg);
                console.log(typeof this.newVehicle.licenseState);
                console.log(typeof this.newVehicle.licenseNumber);
                console.log(typeof this.newVehicle.vehicleType);
                this.$axios
                    .post("/vehicles", {
                        make: this.newVehicle.make,
                        model: this.newVehicle.model,
                        color: this.newVehicle.color,
                        capacity: this.newVehicle.capacity,
                        mpg: this.newVehicle.mpg,
                        licenseState: this.newVehicle.licenseState,
                        licenseNumber: this.newVehicle.licenseNumber,
                        vehicleType: this.newVehicle.vehicleType,
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
                        text: entry.name,
                        value: entry.abbreviation
                    }
                })
            });
        }
    }
</script>

<style scoped>
</style>