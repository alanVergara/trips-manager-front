<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-button class="btn-info float-right my-4" v-b-modal.trip-create>Nuevo viaje</b-button>
            </b-col>
        </b-row>
        <b-alert :show="alert" dismissible :variant="variantalert">{{message}}</b-alert>
        <!-- INIT TABLE -->
        <b-table
            :items="trips"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
            stacked="md"
            show-empty
            small
        >
            <template #cell(actions)="row">
                <b-button size="sm" @click.prevent="editTrip(row.item)" class="btn-info mr-1">
                    Editar
                </b-button>
                <b-button size="sm" @click.prevent="deleteTrip(row.item)" class="btn-danger mr-1">
                    Eliminar
                </b-button>
            </template>
            <template #row-details="row">
                <b-card>
                    <ul>
                        <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                    </ul>
                </b-card>
            </template>
        </b-table>
        <!-- END TABLE -->

        <b-row>
            <!-- INIT TABLE ITEMS QUANTITY -->
            <b-col sm="4" md="3" class="my-1">
                <b-form-group
                    label="Elementos por página"
                    label-for="per-page-select"
                    label-cols-sm="6"
                    label-cols-md="6"
                    label-cols-lg="6"
                    label-align-sm="right"
                    label-size="sm"
                    class="mb-0"
                >
                <b-form-select
                    id="per-page-select"
                    v-model="perPage"
                    :options="pageOptions"
                    size="sm"
                ></b-form-select>
                </b-form-group>
            </b-col>
            <!-- END TABLE ITEMS QUANTITY -->

            <!-- INIT TABLE PAGINATION -->
            <b-col sm="8" md="9" class="my-1">
                <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    align="fill"
                    size="sm"
                    class="my-0"
                ></b-pagination>
            </b-col>
            <!-- END TABLE PAGINATION -->
        </b-row>

        <!-- Creation modal -->
        <b-modal
            id="trip-create"
            ref="modal"
            title="Crear viaje"
            @show="resetCreateModal"
            @hidden="resetCreateModal"
            hide-footer
        >
            <b-form @submit.prevent="createTrip">
                <b-form-group id="in-group-name" label="Nombre:" label-for="input-name">
                    <b-form-input
                        id="input-name"
                        v-model="form.name"
                        placeholder="Nombre Viaje"
                        required
                    ></b-form-input>
                </b-form-group>

                <b-row class="mx-1">
                    <b-form-group id="in-group-begin-at-date" label="Fecha Inicio:" label-for="input-begin-at-date">
                        <b-form-datepicker 
                            id="input-begin-at-date"
                            v-model="form.begin_at_date"
                            :min="min"
                            :hide-header="true"
                            :label-help="''"
                            locale="es"
                            :state="validateDate"
                            placeholder="Seleccione una fecha"
                            required
                        ></b-form-datepicker>
                    </b-form-group>
                    <b-form-group class="ml-2" id="in-group-begin-at-time" label="Hora Inicio:" label-for="input-begin-at-time">
                        <b-form-timepicker 
                            id="input-begin-at-time"
                            v-model="form.begin_at_time"
                            placeholder="Seleccione una hora"
                            locale="es"
                            :state="validateTime"
                            :hide-header="true"
                            :no-close-button="true"
                            required
                        ></b-form-timepicker>
                    </b-form-group>
                </b-row>

                <b-form-group id="in-group-route" label="Ruta:" label-for="input-route">
                    <b-form-select
                        id="input-route"
                        v-model="form.route"
                        :options="routes"
                        value-field="id"
                        text-field="name"
                        required
                    ></b-form-select>
                </b-form-group>

                <b-form-group id="in-group-bus" label="Bus:" label-for="input-bus">
                    <b-form-select
                        id="input- bus"
                        v-model="form.bus"
                        :options="buses"
                        value-field="id"
                        text-field="num_plate"
                        required
                    ></b-form-select>
                </b-form-group>

                <b-button class="mr-2 float-right" type="submit" variant="primary">Crear viaje</b-button>
                <b-button class="mr-2 float-right" variant="danger" @click="closeModal('trip-create')">Cerrar</b-button>
            </b-form>
        </b-modal>

        <b-modal
            id="trip-delete"
            ref="modal"
            title="Borrar Viaje"
            hide-footer
        >
            <p>Esta seguro que desea borrar el viaje {{nameTripToDelete}}</p>
            <b-button class="mr-2 float-right" variant="primary"  @click="closeModal('trip-delete')">Borrar</b-button>
            <b-button class="mr-2 float-right" variant="danger" @click="closeModal('trip-delete')">Cerrar</b-button>
        </b-modal>
    </b-container>
</template>

<script>
    import axios from "axios";

    export default {
        name: 'TripsList',
        data() {
            const now = new Date()
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            const minDate = new Date(today)
            return {
                trips: [],
                routes: [],
                buses: [],
                loading: false,
                fields: [
                    { key: 'name', label: 'Nombre'},
                    { key: 'begin_at', label: 'Horario Inicio'},
                    { key: 'route', label: 'Id Ruta' },
                    { key: 'actions', label: ''}
                ],
                totalRows: 100,
                currentPage: 1,
                perPage: 5,
                pageOptions: [5, 10, 15],
                infoModal: {
                    id: 'info-modal',
                    title: '',
                    content: ''
                },
                form: {
                    name: '',
                    begin_at_date: '',
                    begin_at_time: '',
                    route: null,
                    bus: null
                },
                min: minDate,
                alert: false,
                variantalert: 'error',
                message: '',
                nameTripToDelete: ''
            }
        },
        created() {
            this.getTrips();
            this.getRoutes();
            this.getBuses();
        },
        methods: {
            async getTrips(){
                try {
                    this.loading = true;
                    const response = await axios.get("trip/trips/");
                    this.trips = response.data;

                    console.log(response)
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al cargar el listado de viajes.';
                    this.variantalert = 'error';
                } finally {
                    this.loading = false;
                }
            },
            editTrip(trip){
                console.log("editando viaje");
                console.log(trip);
            },
            deleteTrip(trip){
                this.$bvModal.show('trip-delete');
                this.nameTripToDelete = trip.name;
                console.log("eliminando viaje");
                console.log(trip);
            },
            async createTrip(){
                try {
                    if(!this.validateDate || !this.validateTime){
                        return;
                    }
                    const data = {
                        'name': this.form.name, 
                        'begin_at': this.form.begin_at_date +'T'+ this.form.begin_at_time, //'2021-02-16T04:02'  2021-02-16T01:04:00
                        'route': this.form.route, 
                        'bus': this.form.bus
                    }
                    this.loading = true;
                    await axios.post("trip/trips/", data);

                    this.alert = true;
                    this.message = 'Viaje creado correctamente.';
                    this.variantalert = 'success';
                    
                    this.getTrips();
                    this.closeModal()
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al crear el viaje.';
                    this.variantalert = 'error';
                }
            },
            async getRoutes(){
                try {
                    this.loading = true;
                    const response = await axios.get("trip/routes/");
                    this.routes = response.data;

                    console.log(response)
                } catch (error) {
                    alert("Error al obtener rutas");
                } finally {
                    this.loading = false;
                }
            },
            async getBuses(){
                try {
                    this.loading = true;
                    const response = await axios.get("trip/buses/");
                    this.buses = response.data;

                    console.log(response)
                } catch (error) {
                    alert("Error al obtener buses");
                } finally {
                    this.loading = false;
                }
            },
            resetCreateModal(){
                this.form = {
                    name: '',
                    begin_at_date: '',
                    begin_at_time: '',
                    route: null,
                    bus: null
                }
            },
            closeModal(name) {
                this.$bvModal.hide(name);
            }
        },
        computed: {
            validateDate(){
                return this.form.begin_at_date !== '';
            },
            validateTime(){
                return this.form.begin_at_time !== '';
            }
        }
    }
</script>