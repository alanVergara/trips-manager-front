<template>
    <b-container>
        <b-row>
            <!-- CREATION BUTTON -->
            <h3 class="my-4">Listado Buses</h3>
            <b-col>
                <b-button class="float-right my-4" variant="primary" v-b-modal.bus-create-update>Nuevo bus</b-button>
            </b-col>
        </b-row>
        <!-- MESSAGE -->
        <b-alert :show="alert" dismissible :variant="variantalert">{{message}}</b-alert>
        <!-- INIT TABLE -->
        <b-table
            :items="buses"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
            stacked="md"
            show-empty
            small
            class="mt-4"
            empty-text="Sin datos para mostrar"
        >
            <!-- ACTIONS INSIDE ITEMS -->
            <template #cell(actions)="row">
                <!-- EDIT BUTTON -->
                <b-button size="sm" @click.prevent="editModalBus(row.item)" class="btn-info mr-1">
                    Editar
                </b-button>
                <!-- DELETE BUTTON -->
                <b-button size="sm" @click.prevent="deleteModalBus(row.item)" class="btn-danger mr-1">
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
            id="bus-create-update"
            ref="modal"
            :title="titleCreateUpdateBus"
            @show="resetCreateModal"
            @hidden="resetCreateModal"
            hide-footer
        >
            <b-form @submit.prevent="createBus">
                <!-- INPUT FIELD NUM-PLATE -->
                <b-form-group id="in-group-num-plate" label="Patente:" label-for="input-num-plate">
                    <b-form-input
                        id="input-num-plate"
                        v-model="form.num_plate"
                        placeholder="Patente Bus"
                        required
                    ></b-form-input>
                </b-form-group>
                <!-- INPUT FIELD DRIVER -->
                <b-form-group id="in-group-driver" label="Conductor:" label-for="input-driver">
                    <b-form-select
                        id="input-driver"
                        v-model="form.driver"
                        :options="drivers"
                        value-field="id"
                        text-field="username"
                    ></b-form-select>
                </b-form-group>

                <!-- FORM ACTIONS BUTTONS -->
                <b-button class="mr-2 float-right" type="submit" variant="primary">{{ busToUpdate ? 'Editar bus' : 'Crear bus' }}</b-button>
                <b-button class="mr-2 float-right" variant="danger" @click="closeModal('bus-create-update')">Cerrar</b-button>
            </b-form>
        </b-modal>
        <!-- END MODAL CREATE/UPDATE -->

        <!-- INIT MODAL DELETE -->
        <b-modal
            id="bus-delete"
            ref="modal"
            title="Borrar Bus"
            ok-title="Borrar"
            header-close-label="Cerrar"
            @ok="deleteBus"
        >
            <p>Esta seguro que desea borrar el bus: {{busToDelete ? busToDelete.num_plate : ''}}</p>
        </b-modal>
        <!-- END MODAL DELETE -->
    </b-container>
</template>

<script>
    import axios from "axios";

    export default {
        name: 'BusesList',
        data() {
            return {
                loading: false,
                alert: false,
                variantalert: 'danger',
                message: '',
                titleCreateUpdateBus:'Crear Bus',

                buses: [],
                drivers: [],
                fields: [
                    { key: 'num_plate', label: 'Patente'},
                    { key: 'driver', label: 'Conductor Asignado'},
                    { key: 'actions', label: ''}
                ],
                totalRows: 0,
                currentPage: 1,
                perPage: 5,
                pageOptions: [5, 10, 15],

                form: {
                    num_plate: '',
                    driver: null
                },

                busToDelete: null,
                busToUpdate: null
            }
        },
        created() {
            this.getBuses();
            this.getDrivers();
        },
        methods: {
            /**
             * Get buses for list
             */
            async getBuses(){
                try {
                    this.loading = true;
                    const response = await axios.get("trip/buses/");
                    this.totalRows = response.data.length
                    this.buses = response.data;
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al cargar el listado de buses.';
                    this.variantalert = 'danger';
                } finally {
                    this.loading = false;
                }
            },
            /**
             * Open modal for edit bus
             */
            editModalBus(bus){
                this.$bvModal.show('bus-create-update');
                this.busToUpdate = bus;
                this.titleCreateUpdateBus = 'Editar Bus';

                this.form = {
                    num_plate: bus.num_plate,
                    driver: bus.driver
                }
            },
            /**
             * Open modal for delete bus
             */
            deleteModalBus(bus){
                this.$bvModal.show('bus-delete');
                this.busToDelete = bus;
            },
            /**
             * Function for delete bus
             */
            async deleteBus(){
                try {
                    this.loading = true;
                    await axios.delete("trip/buses/"+this.busToDelete.id);
                    this.alert = true;
                    this.message = 'Bus eliminado correctamente.';
                    this.variantalert = 'success';

                    this.getBuses();
                    this.closeModal('bus-delete');
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al borrar el bus.';
                    this.variantalert = 'danger';
                } finally {
                    this.loading = false;
                }
            },
            /**
             * Create a bus
             */
            async createBus(){
                try {
                    this.loading = true;
                    const data = {
                        'num_plate': this.form.num_plate, 
                        'driver': this.form.driver
                    }

                    if(this.busToUpdate && this.busToUpdate.id ){
                        await axios.put("trip/buses/"+this.busToUpdate.id+"/", data);
                        this.message = 'Bus editado correctamente.';
                    }else{
                        await axios.post("trip/buses/", data);
                        this.message = 'Bus creado correctamente.';
                    }

                    this.alert = true;
                    this.variantalert = 'success';
                    
                    this.busToUpdate = null;
                    this.resetCreateModal();
                    this.getBuses();
                    this.closeModal('bus-create-update');
                } catch (error) {
                    this.resetCreateModal();
                    this.alert = true;
                    if(this.busToUpdate && this.busToUpdate.id ){
                        this.message = 'Error al editar el bus.';
                    }else{
                        this.message = 'Error al crear el bus.';
                    }
                    this.variantalert = 'danger';
                } finally {
                    this.loading = false;
                }
            },
            /**
             * Get drivers for select
             */
            async getDrivers(){
                try {
                    this.loading = true;
                    const response = await axios.get("user/drivers/");
                    this.drivers = response.data;
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al obtener conductores para creación del bus.';
                    this.variantalert = 'danger';
                } finally {
                    this.loading = false;
                }
            },
            resetCreateModal(){
                this.form = {
                    num_plate: '',
                    driver: null
                }
            },
            closeModal(name) {
                this.titleCreateUpdateBus = 'Crear Bus';
                this.$bvModal.hide(name);
            }
        }
    }
</script>