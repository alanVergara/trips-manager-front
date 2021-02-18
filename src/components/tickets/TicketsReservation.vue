<template>
    <b-container>
        <!-- MESSAGE -->
        <b-alert :show="alert" dismissible :variant="variantalert">{{message}}</b-alert>
        <!-- INIT FILTERS FORM -->
        <b-form @submit.prevent="filterTrip" class="mt-4">  
            <b-row class="row-6">
                <!-- FILTER FIELD ROUTE -->
                <b-form-group class="col-4 m-0" id="in-group-trip" label="Viaje:" label-for="input-trip">
                    <b-form-select
                        id="input-trip"
                        v-model="tripFilter"
                        :options="trips"
                        value-field="tickets_trip"
                        text-field="name"
                        required
                        @change="completeTicketsInformation"
                    ></b-form-select>
                </b-form-group>
            </b-row>
        </b-form>
        <!-- END FILTERS FORM -->
        <h3 class="mt-5">Tickets</h3>
        <div v-if="showTickets">
            <div class="mt-4">
                <b-card-group>
                    <b-card :bg-variant="this.tickets[0].reserved ? 'danger' : 'success'" text-variant="white" header="Asiento 1" class="text-center mr-2">
                        <b-button v-if="!this.tickets[0].reserved" class="mt-2" variant="primary" @click.prevent="reserveTicket(0)">Reservar</b-button>
                        <p style="color:white;" v-if="this.tickets[0].reserved">Reservado</p>
                    </b-card>

                    <b-card :bg-variant="this.tickets[1].reserved ? 'danger' : 'success'" text-variant="white" header="Asiento 2" class="text-center mr-6">
                        <b-button v-if="!this.tickets[1].reserved" class="mt-2" variant="primary" @click.prevent="reserveTicket(1)">Reservar</b-button>
                        <p style="color:white;" v-if="this.tickets[1].reserved">Reservado</p>
                    </b-card>

                    <b-card :bg-variant="this.tickets[2].reserved ? 'danger' : 'success'" text-variant="white" header="Asiento 3" class="text-center ml-6 mr-2">
                        <b-button v-if="!this.tickets[2].reserved" class="mt-2" variant="primary" @click.prevent="reserveTicket(2)">Reservar</b-button>
                        <p style="color:white;" v-if="this.tickets[2].reserved">Reservado</p>
                    </b-card>

                    <b-card :bg-variant="this.tickets[3].reserved ? 'danger' : 'success'" text-variant="white" header="Asiento 4" class="text-center">
                        <b-button v-if="!this.tickets[3].reserved" class="mt-2" variant="primary" @click.prevent="reserveTicket(3)">Reservar</b-button>
                        <p style="color:white;" v-if="this.tickets[3].reserved">Reservado</p>
                    </b-card>
                </b-card-group>
            </div>
            <div class="mt-4">
                <b-card-group>
                    <b-card :bg-variant="this.tickets[4].reserved ? 'danger' : 'success'" text-variant="white" header="Asiento 5" class="text-center mr-2">
                        <b-button v-if="!this.tickets[4].reserved" class="mt-2" variant="primary" @click.prevent="reserveTicket(4)">Reservar</b-button>
                        <p style="color:white;" v-if="this.tickets[4].reserved">Reservado</p>
                    </b-card>

                    <b-card :bg-variant="this.tickets[5].reserved ? 'danger' : 'success'" text-variant="white" header="Asiento 6" class="text-center mr-6">
                        <b-button v-if="!this.tickets[5].reserved" class="mt-2" variant="primary" @click.prevent="reserveTicket(5)">Reservar</b-button>
                        <p style="color:white;" v-if="this.tickets[5].reserved">Reservado</p>
                    </b-card>

                    <b-card :bg-variant="this.tickets[6].reserved ? 'danger' : 'success'" text-variant="white" header="Asiento 7" class="text-center ml-6 mr-2">
                        <b-button v-if="!this.tickets[6].reserved" class="mt-2" variant="primary" @click.prevent="reserveTicket(6)">Reservar</b-button>
                        <p style="color:white;" v-if="this.tickets[6].reserved">Reservado</p>
                    </b-card>

                    <b-card :bg-variant="this.tickets[7].reserved ? 'danger' : 'success'" text-variant="white" header="Asiento 8" class="text-center">
                        <b-button v-if="!this.tickets[7].reserved" class="mt-2" variant="primary" @click.prevent="reserveTicket(7)">Reservar</b-button>
                        <p style="color:white;" v-if="this.tickets[7].reserved">Reservado</p>
                    </b-card>
                </b-card-group>
            </div>
            <div class="mt-4">
                <b-card-group>
                    <b-card :bg-variant="this.tickets[8].reserved ? 'danger' : 'success'" text-variant="white" header="Asiento 9" class="text-center mr-6">
                        <b-button v-if="!this.tickets[8].reserved" class="mt-2" variant="primary" @click.prevent="reserveTicket(8)">Reservar</b-button>
                        <p style="color:white;" v-if="this.tickets[8].reserved">Reservado</p>
                    </b-card>
                    <b-card :bg-variant="this.tickets[9].reserved ? 'danger' : 'success'" text-variant="white" header="Asiento 10" class="text-center ml-6">
                        <b-button v-if="!this.tickets[9].reserved" class="mt-2" variant="primary" @click.prevent="reserveTicket(9)">Reservar</b-button>
                        <p style="color:white;" v-if="this.tickets[9].reserved">Reservado</p>
                    </b-card>
                </b-card-group>
            </div>
        </div>
    </b-container>
</template>

<script>
    import axios from "axios";

    export default {
        name:"TicketsReservation",
        data(){
            return {
                loading: false,
                alert: false,
                variantalert: 'danger',
                message: '',

                trips: [],
                tripFilter: null,
                tickets: [],
                showTickets: false
            }
        },
        created() {
            this.filterTrip();
            this.completeTicketsInformation();
        },
        methods:{
            async filterTrip(){
                try {
                    this.loading = true;
                    const response = await axios.get("trip/trips/");
                    this.trips = response.data;
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al obtener viajes para filtro.';
                    this.variantalert = 'danger';
                } finally {
                    this.loading = false;
                }
            },
            async completeTicketsInformation(){
                 this.showTickets = false;
                
                if(this.tripFilter && this.tripFilter.length > 0){
                    for(const ticket in this.tripFilter){
                        let detail = await this.getTicketDetail(this.tripFilter[ticket])
                        this.tickets[ticket] = detail;
                    }
                    this.showTickets = true;
                }else{
                    this.showTickets = false;
                }
            },
            async getTicketDetail(ticket_id){
                try {
                    this.loading = true;
                    const response = await axios.get("trip/tickets/"+ticket_id+"/");
                    return response.data;
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al obtener información del ticket.';
                    this.variantalert = 'danger';
                } finally {
                    this.loading = false;
                }
            },
            async reserveTicket(position){
                try {
                    this.loading = true;
                    const ticket_id = this.tickets[position]['id'];
                    let data = {
                        'reserved':true
                    }
                    await axios.put("trip/tickets/"+ticket_id+"/", data);
                    this.completeTicketsInformation();
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al reservar el ticket.';
                    this.variantalert = 'danger';
                } finally {
                    this.loading = false;
                }
            }
        }
    }
</script>