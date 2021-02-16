<template>
    <b-container>
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
                <b-button size="sm" @click.prevent="editModalTrip(row.item)" class="btn-info mr-1">
                    Editar
                </b-button>
                <b-button size="sm" @click.prevent="deleteModalTrip(row.item)" class="btn-danger mr-1">
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

        <!-- INIT MODAL CREATE/UPDATE -->
        <b-modal
            id="trip-create"
            ref="modal"
            :title="titleCreateUpdateTrip"
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

                <b-button class="mr-2 float-right" type="submit" variant="primary">{{ tripToUpdate ? 'Editar viaje' : 'Crear viaje' }}</b-button>
                <b-button class="mr-2 float-right" variant="danger" @click="closeModal('trip-create')">Cerrar</b-button>
            </b-form>
        </b-modal>
        <!-- END MODAL CREATE/UPDATE -->

        <!-- INIT MODAL DELETE -->
        <b-modal
            id="trip-delete"
            ref="modal"
            title="Borrar Viaje"
            ok-title="Borrar"
            header-close-label="Cerrar"
            @ok="deleteTrip"
        >
            <p>Esta seguro que desea borrar el viaje {{tripToDelete ? tripToDelete.name : ''}}</p>
        </b-modal>
        <!-- END MODAL DELETE -->
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
                form: {
                    name: '',
                    begin_at_date: '',
                    begin_at_time: '',
                    route: null,
                    bus: null
                },
                min: minDate,
                alert: false,
                variantalert: 'danger',
                message: '',
                titleCreateUpdateTrip:'Crear Viaje',
                tripToDelete: null,
                tripToUpdate: null
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
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al cargar el listado de viajes.';
                    this.variantalert = 'danger';
                } finally {
                    this.loading = false;
                }
            },
            editModalTrip(trip){
                this.$bvModal.show('trip-create');
                this.tripToUpdate = trip;
                this.titleCreateUpdateTrip = 'Editar Viaje';
                let datetime = trip.begin_at.split('T');

                this.form = {
                    name: trip.name,
                    begin_at_date: datetime[0],
                    begin_at_time: datetime[1].replace('Z',''),
                    route: trip.route,
                    bus: trip.bus
                }
            },
            deleteModalTrip(trip){
                this.$bvModal.show('trip-delete');
                this.tripToDelete = trip;
            },
            async deleteTrip(){
                try {
                    this.loading = true;
                    await axios.delete("trip/trips/"+this.tripToDelete.id);
                    this.alert = true;
                    this.message = 'Viaje eliminado correctamente.';
                    this.variantalert = 'success';

                    this.getTrips();
                    this.closeModal('trip-delete');
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al borrar el viaje.';
                    this.variantalert = 'danger';
                }
            },
            async createTrip(){
                try {
                    if(!this.validateDate || !this.validateTime){
                        return;
                    }
                    const data = {
                        'name': this.form.name, 
                        'begin_at': this.form.begin_at_date +'T'+ this.form.begin_at_time,
                        'route': this.form.route, 
                        'bus': this.form.bus
                    }
                    this.loading = true;
                    if(this.tripToUpdate && this.tripToUpdate.id ){
                        await axios.put("trip/trips/"+this.tripToUpdate.id+"/", data);
                        this.message = 'Viaje editado correctamente.';
                    }else{
                        await axios.post("trip/trips/", data);
                        this.message = 'Viaje creado correctamente.';
                    }

                    this.alert = true;
                    this.variantalert = 'success';
                    
                    this.resetCreateModal();
                    this.getTrips();
                    this.closeModal('trip-create');
                } catch (error) {
                    this.resetCreateModal();
                    this.alert = true;
                    if(this.tripToUpdate && this.tripToUpdate.id ){
                        this.message = 'Error al editar el viaje.';
                    }else{
                        this.message = 'Error al crear el viaje.';
                    }
                    this.variantalert = 'danger';
                }
            },
            async getRoutes(){
                try {
                    this.loading = true;
                    const response = await axios.get("trip/routes/");
                    this.routes = response.data;
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al obtener rutas para creación de viaje.';
                    this.variantalert = 'danger';
                } finally {
                    this.loading = false;
                }
            },
            async getBuses(){
                try {
                    this.loading = true;
                    const response = await axios.get("trip/buses/");
                    this.buses = response.data;
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al obtener buses para creación de viaje.';
                    this.variantalert = 'danger';
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
                this.titleCreateUpdateTrip = 'Crear Viaje';
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