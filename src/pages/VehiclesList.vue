<template>
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
            <td>
              <v-icon small class="ml-2" @click="updateVehicle(item)">
                mdi-pencil
              </v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
</template>

<script>
    export default {
        name: "vehicesList",
        data: function() {
            return {
                dialog: false,
                headers: [
                    {text: "Make", value: "make"},
                    {text: "Model", value: "model"},
                    {text: "Color", value: "color"},
                    {text: "Capacity", value: "capacity"},
                    {text: "mpg", value: "mpg"},
                    {text: "License State", value: "licenseState"},
                    {text: "License Number", value: "licenseNumber"},
                ],
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
                },
                defaultItem: {
                    make: '',
                    model: '',
                    color: '',
                    capacity: 0,
                    mpg: 0,
                    licenseState: '',
                    licenseNumber: '',
                },
            }
        },
        mounted: function () {
            this.$axios.get("/vehicleslist").then(response => {
                console.log("RESPONSE", response);
                this.vehicleslist = response.data;
            })
        },
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            },
        },
        updateVehicle(item) {
            console.log("UPDATE", JSON.stringify(item, null, 2));
            this.showSnackbar("Sorry, update is not yet implemented.");
        },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      },
    }
</script>

<style scoped>
</style>