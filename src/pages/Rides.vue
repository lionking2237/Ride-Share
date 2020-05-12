<template>
    <v-data-table :headers="headers" :items="rides"/>
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

                ],
                rides: [],
            }
        },
        mounted: function () {
            this.$axios.get("/rides").then(response => {
                console.log("RESPONSE", response);
                this.rides = response.data;
            })
        }
    }
</script>

<style scoped>

</style>