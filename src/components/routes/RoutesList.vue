<template>
    <b-container>
        <b-row>
            <!-- CREATION BUTTON -->
            <h3 class="my-4">Listado de rutas</h3>
            <b-col>
                <b-button class="float-right my-4" variant="primary" v-b-modal.route-create-update>Nueva ruta</b-button>
            </b-col>
        </b-row>
        <!-- MESSAGE -->
        <b-alert :show="alert" dismissible :variant="variantalert">{{message}}</b-alert>
        <!-- INIT TABLE -->
        <b-table
            :items="routes"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
            stacked="md"
            show-empty
            small
            empty-text="Sin datos para mostrar"
        >
            <!-- ACTIONS INSIDE ITEMS -->
            <template #cell(actions)="row">
                <!-- EDIT BUTTON -->
                <b-button size="sm" @click.prevent="editModalRoute(row.item)" class="btn-info mr-1">
                    Editar
                </b-button>
                <!-- DELETE BUTTON -->
                <b-button size="sm" @click.prevent="deleteModalRoute(row.item)" class="btn-danger mr-1">
                    Eliminar
                </b-button>
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
            id="route-create-update"
            ref="modal"
            :title="titleCreateUpdateRoute"
            @show="resetCreateModal"
            @hidden="resetCreateModal"
            hide-footer
        >
            <b-form @submit.prevent="createRoute">
                <!-- INPUT FIELD NAME -->
                <b-form-group id="in-group-name" label="Nombre:" label-for="input-name">
                    <b-form-input
                        id="input-name"
                        v-model="form.name"
                        placeholder="Nombre Ruta"
                        required
                    ></b-form-input>
                </b-form-group>
                <!-- INPUT FIELD ORIGIN -->
                <b-form-group id="in-group-origin" label="Origen:" label-for="input-origin">
                    <b-form-input
                        id="input-origin"
                        v-model="form.origin"
                        placeholder="Origen"
                        required
                    ></b-form-input>
                </b-form-group>
                <!-- INPUT FIELD DESTINATION -->
                <b-form-group id="in-group-destination" label="Destino:" label-for="input-destination">
                    <b-form-input
                        id="input-destination"
                        v-model="form.destination"
                        placeholder="Destino"
                        required
                    ></b-form-input>
                </b-form-group>

                <!-- FORM ACTIONS BUTTONS -->
                <b-button class="mr-2 float-right" type="submit" variant="primary">{{ routeToUpdate ? 'Editar ruta' : 'Crear ruta' }}</b-button>
                <b-button class="mr-2 float-right" variant="danger" @click="closeModal('route-create-update')">Cerrar</b-button>
            </b-form>
        </b-modal>
        <!-- END MODAL CREATE/UPDATE -->

        <!-- INIT MODAL DELETE -->
        <b-modal
            id="route-delete"
            ref="modal"
            title="Borrar Ruta"
            ok-title="Borrar"
            header-close-label="Cerrar"
            @ok="deleteRoute"
        >
            <p>Esta seguro que desea borrar la ruta: {{routeToDelete ? routeToDelete.name : ''}}</p>
        </b-modal>
        <!-- END MODAL DELETE -->
    </b-container>
</template>

<script>
    import axios from "axios";

    export default {
        name: 'RoutesList',
        data() {
            return {
                loading: false,
                alert: false,
                variantalert: 'danger',
                message: '',
                titleCreateUpdateRoute:'Crear Ruta',

                routes: [],
                fields: [
                    { key: 'name', label: 'Nombre'},
                    { key: 'origin', label: 'Origen'},
                    { key: 'destination', label: 'Destino'},
                    { key: 'average', label: 'Promedio Pasajeros'},
                    { key: 'actions', label: ''}
                ],
                totalRows: 0,
                currentPage: 1,
                perPage: 5,
                pageOptions: [5, 10, 15],

                form: {
                    name: '',
                    origin: '',
                    destination: ''
                },

                routeToDelete: null,
                routeToUpdate: null
            }
        },
        created() {
            //this.getRoutes();
            this.getRoutesWithAverage();
        },
        methods: {
            /**
             * Get routes for list
             */
            async getRoutes(){
                try {
                    this.loading = true;
                    const response = await axios.get("trip/routes/");
                    this.totalRows = response.data.length
                    this.routes = response.data;
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al cargar el listado de rutas.';
                    this.variantalert = 'danger';
                } finally {
                    this.loading = false;
                }
            },
            /**
             * Get routes for list with average of usage
             */
            async getRoutesWithAverage(){
                try {
                    this.loading = true;
                    const response = await axios.get("trip/routes/average_passengers/");
                    this.totalRows = response.data.length
                    this.routes = response.data;
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al cargar el listado de rutas.';
                    this.variantalert = 'danger';
                } finally {
                    this.loading = false;
                }
            },
            /**
             * Open modal for edit route
             */
            editModalRoute(route){
                this.$bvModal.show('route-create-update');
                this.routeToUpdate = route;
                this.titleCreateUpdateRoute = 'Editar Ruta';

                this.form = {
                    name: route.name,
                    origin: route.origin,
                    destination: route.destination
                }
            },
            /**
             * Open modal for delete route
             */
            deleteModalRoute(route){
                this.$bvModal.show('route-delete');
                this.routeToDelete = route;
            },
            /**
             * Function for delete route
             */
            async deleteRoute(){
                try {
                    this.loading = true;
                    await axios.delete("trip/routes/"+this.routeToDelete.id);
                    this.alert = true;
                    this.message = 'Ruta eliminada correctamente.';
                    this.variantalert = 'success';

                    this.getRoutes();
                    this.closeModal('route-delete');
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al borrar la ruta.';
                    this.variantalert = 'danger';
                } finally {
                    this.loading = false;
                }
            },
            /**
             * Function for create route
             */
            async createRoute(){
                try {
                    this.loading = true;
                    const data = {
                        'name': this.form.name, 
                        'origin': this.form.origin,
                        'destination': this.form.destination
                    }

                    if(this.routeToUpdate && this.routeToUpdate.id ){
                        await axios.put("trip/routes/"+this.routeToUpdate.id+"/", data);
                        this.message = 'Ruta editada correctamente.';
                    }else{
                        await axios.post("trip/routes/", data);
                        this.message = 'Ruta creada correctamente.';
                    }

                    this.alert = true;
                    this.variantalert = 'success';
                    
                    this.resetCreateModal();
                    this.getRoutes();
                    this.closeModal('route-create-update');
                } catch (error) {
                    this.resetCreateModal();
                    this.alert = true;
                    if(this.routeToUpdate && this.routeToUpdate.id ){
                        this.message = 'Error al editar la ruta.';
                    }else{
                        this.message = 'Error al crear la ruta.';
                    }
                    this.variantalert = 'danger';
                } finally {
                    this.loading = false;
                }
            },
            resetCreateModal(){
                this.form = {
                    name: '',
                    origin: '',
                    destination: ''
                }
            },
            closeModal(name) {
                this.titleCreateUpdateRoute = 'Crear Ruta';
                this.$bvModal.hide(name);
            }
        }
    }
</script>