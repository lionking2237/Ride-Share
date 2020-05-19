<template>
    <v-container>
        <h4 class="display-1">Where Do We Ride?</h4>

        <v-data-table :headers="headers" :items="locations"/>
    </v-container>
</template>

<script>
    export default {
        name: "Locations",
        data: function () {
            return {
                headers: [
                    {text: "Name", value: "name"},
                    {text: "Address", value: "address"},
                    {text: "City", value: "city"},
                    {text: "State", value: "state"},
                    {text: "Zip Code", value: "zipCode"},
                ],
                locations: []
            }
        },
        mounted: function () {
            this.$axios.get("/locations").then(response => {
                console.log("RESPONSE", response);
                this.locations = response.data;
            })
        }
    }
</script>