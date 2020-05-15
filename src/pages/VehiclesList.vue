<template>
  <div>
    <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="vehicleslist"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.make }}</td>
            <td>{{ item.model }}</td>
            <td>{{ item.color }}</td>
            <td>{{ item.capacity }}</td>
            <td>{{ item.mpg }}</td>
            <td>{{ item.licenseState }}</td>
            <td>{{ item.licenseNumber }}</td>
            <td>{{item.type}}</td>
            <td>
              <v-dialog v-model="dialog" max-width="500px">
                <template>
                  <v-btn color="primary" dark class="mb-2" v-on="updateVehicle(item)">Push</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-bind:rules="rules.required" v-model="editedItem.make" label="Make"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-bind:rules="rules.required" v-model="editedItem.model" label="Model"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-bind:rules="rules.required" v-model="editedItem.color" label="Color"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-bind:rules="rules.required" v-model="editedItem.capacity" label="Capacity"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-bind:rules="rules.required" v-model="editedItem.mpg" label="MPG"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-bind:rules="rules.licenseNum" v-model="editedItem.licenseNumber" label="License Number"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-overflow-btn
                                  v-bind:rules="rules.required"
                                  v-model="editedItem.licenseState"
                                  :items="states"
                                  label="States"
                          ></v-overflow-btn>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-overflow-btn
                                  v-bind:rules="rules.required"
                                  v-model="editedItem.vehicleType"
                                  :items="vehicleTypes"
                                  label="Vehicle Types"
                          ></v-overflow-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

            </td>
          </tr>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="ml-2" @click="updateVehicle(item)">
            mdi-pencil
          </v-icon>
        </template>

      </v-data-table>
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
        name: "vehiclesList",
        methods:{

          save: function(){
            this.$axios.patch("/vehicles/{id}", {
              make: this.editedItem.make,
              model: this.editedItem.model,
              color: this.editedItem.color,
              capacity:this.editedItem.capacity,
              mpg: this.editedItem.mpg,
              licenseState: this.editedItem.licenseState,
              licenseNumber: this.editedItem.licenseNumber,
              type:this.editedItem.type
            });
          },
          showSnackbar(text) {
            this.snackbar.text = text;
            this.snackbar.show = true;
          },

          updateVehicle: function(item){
            this.editedIndex = this.vehicleslist.indexOf(item);
            this.editedItem =  item;
            console.log("Hey look here its "+this.editedItem);
            this.dialog = true;
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
          },
        },
        data: function() {
            return {
              rules:{
                licenseNum:[(val) => val.length > 0 && val.length < 16],
                required: [(val) => val.length > 0|| (val)>0 || "Required"],
              },
                dialog: false,
                headers: [
                    {text: "Make", value: "make"},
                    {text: "Model", value: "model"},
                    {text: "Color", value: "color"},
                    {text: "Capacity", value: "capacity"},
                    {text: "mpg", value: "mpg"},
                    {text: "License State", value: "licenseState"},
                    {text: "License Number", value: "licenseNumber"},
                    {text: "Vehicle Type", value: "type"}
                ],
              snackbar: {
                show: false,
                text: ""
              },
                vehicleTypes: [],
                states: [],
                vehicleslist: [],
                editedIndex: -1,
                editedItem: {
                    make: '',
                    model: '',
                    color: '',
                    capacity: 0,
                    mpg: 0,
                    licenseState: '',
                    licenseNumber: '',
                    type:''
                },
                defaultItem: {
                    make: '',
                    model: '',
                    color: '',
                    capacity: 0,
                    mpg: 0,
                    licenseState: '',
                    licenseNumber: '',
                    type:''
                },
            }
        },
        mounted: function () {
            this.$axios.get("/vehicleslist").then(response => {
                console.log("RESPONSE", response);
                this.vehicleslist = response.data.map(vehicle =>({
                  make: vehicle.make,
                  model: vehicle.model,
                  color: vehicle.color,
                  capacity: vehicle.capacity,
                  mpg: vehicle.mpg,
                  licenseState: vehicle.licenseState,
                  licenseNumber: vehicle.licenseNumber,
                  type: vehicle.vehicleTypes.type
                }));
            });



        },

        computed: {
            formTitle: function () {
                return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            },
        },
    }
</script>

<style scoped>
</style>