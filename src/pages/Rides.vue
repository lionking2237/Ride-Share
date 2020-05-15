<template>
    <v-data-table :headers="headers" :items="rides">
        <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    </v-data-table>
</template>

<script>
    export default {
        name: "Rides",
        data: function() {
            return {
                headers: [
                    {text: "Date", value: "date"},
                    {text: "Time", value: "time"},
                    {text: "Distance", value: "distance"},
                    {text: "Fuel Price", value: "fuelPrice"},
                    {text: "Fee", value: "fee"},
                    {text: "Driver", value: "driver"},
                ],
                rides: [],
            }
        },
        mounted: function () {
            this.$axios.get("/rides").then(response => {
                console.log("RESPONSE", response);
                this.rides = response.data.map(ride =>({
                    date: ride.date,
                    time: ride.time,
                    distance: ride.distance,
                    fuelPrice: ride.fuelPrice,
                    fee: ride.fee,
                    driver: ride.drivers.firstName + " " +ride.drivers.lastName,
                    phone: ride.drivers.phone,
                    license: ride.drivers.licenseNumber,
                }));
            })
        }
    }
</script>

<style scoped>
</style>