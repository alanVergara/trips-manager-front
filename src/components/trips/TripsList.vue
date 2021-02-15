<template>
    <div>
        <h1>Listado de viajes</h1>
        <div v-for="trip in trips" :key="trip.id">
            <p>{{trip.name}}</p>
        </div>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: 'TripsList',
        data() {
            return {
                trips: [],
                loading: false
            }
        },
        created() {
            this.getTrips();    
        },
        methods: {
            async getTrips(){
                try {
                    this.loading = true;
                    const response = await axios.get("trip/trips/");
                    this.trips = response.data;

                    console.log(response)
                } catch (error) {
                    alert("Error al cargar el listado de viajes");
                } finally {
                    this.loading = false;
                }

            },
            async newTrip(){
                const response = await axios.post("trip/trips/")
            }

        }
    }
</script>