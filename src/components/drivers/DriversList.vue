<template>
    <b-container>
        <b-row>
            <!-- CREATION BUTTON -->
            <h3 class="my-4">Conductores</h3>
            <b-col>
                <b-button class="float-right my-4" variant="primary" v-b-modal.driver-create>Nuevo conductor</b-button>
            </b-col>
        </b-row>
        <!-- MESSAGE -->
        <b-alert :show="alert" fade dismissible :variant="variantalert">{{message}}</b-alert>
        <!-- INIT TABLE -->
        <b-table
            :items="drivers"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
            stacked="md"
            show-empty
            small
        >
            <!-- ACTIONS INSIDE ITEMS -->
            <template #cell(actions)="row">
                <!-- DELETE BUTTON -->
                <b-button size="sm" @click.prevent="deleteModalDriver(row.item)" class="btn-danger mr-1">
                    Eliminar
                </b-button>
            </template>
            <!-- ROW VALUES -->
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

        <!-- INIT MODAL CREATE -->
        <b-modal
            id="driver-create"
            ref="modal"
            :title="titleCreateDriver"
            @show="resetCreateModal"
            @hidden="resetCreateModal"
            hide-footer
        >
            <b-form @submit.prevent="createDriver">
                <!-- INPUT FIELD USERNAME -->
                <b-form-group id="in-group-username" label="Nombre de Usuario:" label-for="input-username">
                    <b-form-input
                        id="input-username"
                        v-model="form.username"
                        placeholder="Nombre de usuario del Conductor"
                        required
                    ></b-form-input>
                </b-form-group>
                <!-- INPUT FIELD PASSWORD -->
                <b-form-group id="in-group-password" label="Contraseña:" label-for="input-password">
                    <b-form-input
                        id="input-password"
                        v-model="form.password"
                        placeholder="Contraseña"
                        type="password"
                        required
                    ></b-form-input>
                </b-form-group>
                <!-- INPUT FIELD PASSWORD CONFIRM -->
                <b-form-group id="in-group-password-confirm" label="Confirmar Contraseña:" label-for="input-password-confirm">
                    <b-form-input
                        id="input-password-confirm"
                        v-model="form.password_confirm"
                        placeholder="Confirmar Contraseña"
                        type="password"
                        required
                    ></b-form-input>
                </b-form-group>

                <!-- FORM ACTIONS BUTTONS -->
                <b-button class="mr-2 float-right" type="submit" variant="primary">Crear conductor</b-button>
                <b-button class="mr-2 float-right" variant="danger" @click="closeModal('driver-create')">Cerrar</b-button>
            </b-form>
        </b-modal>
        <!-- END MODAL CREATE -->

        <!-- INIT MODAL DELETE -->
        <b-modal
            id="driver-delete"
            ref="modal"
            title="Borrar Conductor"
            ok-title="Borrar"
            header-close-label="Cerrar"
            @ok="deleteDriver"
        >
            <p>Esta seguro que desea borrar el conductor: {{driverToDelete ? driverToDelete.name : ''}}</p>
        </b-modal>
        <!-- END MODAL DELETE -->
    </b-container>
</template>

<script>
    import axios from "axios";

    export default {
        name: 'DriversList',
        data() {
            return {
                loading: false,
                alert: false,
                variantalert: 'danger',
                message: '',
                titleCreateDriver:'Crear Conductor',

                drivers: [],
                fields: [
                    { key: 'username', label: 'Nombre'},
                    { key: 'actions', label: ''}
                ],
                totalRows: 0,
                currentPage: 1,
                perPage: 5,
                pageOptions: [5, 10, 15],

                form: {
                    username: '',
                    password: '',
                    password_confirm: ''
                },

                driverToDelete: null
            }
        },
        created() {
            this.getDrivers();
        },
        methods: {
            /**
             * Get drivers for list
             */
            async getDrivers(){
                this.alert = false;
                try {
                    this.loading = true;
                    const response = await axios.get("user/drivers/");
                    this.totalRows = response.data.length
                    this.drivers = response.data;
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al cargar el listado de conductores.';
                    this.variantalert = 'danger';
                } finally {
                    this.loading = false;
                }
            },
            /**
             * Open modal for delete driver
             */
            deleteModalDriver(driver){
                this.$bvModal.show('driver-delete');
                this.driverToDelete = driver;
            },
            async deleteDriver(){
                this.alert = false;
                try {
                    this.loading = true;
                    await axios.delete("user/drivers/"+this.driverToDelete.id);
                    this.alert = true;
                    this.message = 'Conductor eliminado correctamente.';
                    this.variantalert = 'success';

                    this.getDrivers();
                    this.closeModal('driver-delete');
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al borrar el conductor.';
                    this.variantalert = 'danger';
                } finally {
                    this.loading = false;
                }
            },
            /**
             * Function for create driver
             */
            async createDriver(){
                this.alert = false;
                try {
                    this.loading = true;
                    const data = {
                        'username': this.form.username, 
                        'password': this.form.password,
                        'password_confirm': this.form.password_confirm
                    }

                    await axios.post("user/drivers/", data);

                    this.message = 'Conductor creado correctamente.';
                    this.alert = true;
                    this.variantalert = 'success';

                    this.resetCreateModal();
                    this.getDrivers();
                    this.closeModal('driver-create');
                } catch (error) {
                    this.resetCreateModal();
                    this.alert = true;
                    this.variantalert = 'danger';

                    if(error.response && error.response.data && error.response.data.non_field_errors
                        && error.response.data.non_field_errors[0]){
                        this.message = error.response.data.non_field_errors[0];
                    }else{
                        this.message = 'Error al crear el conductor.';
                    }
                } finally {
                    this.loading = false;
                }
            },
            resetCreateModal(){
                this.form = {
                    username: '',
                    password: '',
                    password_confirm: ''
                }
            },
            closeModal(name) {
                this.$bvModal.hide(name);
            }
        }
    }
</script>