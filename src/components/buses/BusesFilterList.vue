<template>
    <b-container>
        <!-- MESSAGE -->
        <b-alert :show="alert" dismissible :variant="variantalert">{{message}}</b-alert>
        <!-- INIT FILTERS FORM -->
        <b-form @submit.prevent="filterBus">  
            <b-row>
                <!-- FILTER FIELD ROUTE -->
                <b-form-group class="col" id="in-group-route" label="Ruta:" label-for="input-route">
                    <b-form-select
                        id="input-route"
                        v-model="formfilter.route"
                        :options="routes"
                        value-field="id"
                        text-field="name"
                        required
                    ></b-form-select>
                </b-form-group>
                <!-- FILTER FIELD PERCENTAGE -->
                <b-form-group class="col" id="in-group-prcentage" label="Porcentaje de ocupación mínimo:" label-for="input-percentage">
                    <b-form-input
                        id="input-percentage"
                        v-model="formfilter.percentage"
                        placeholder="Porcentaje de ocupación"
                        type="number"
                        min="0"
                        max="100"
                        required
                        @blur.prevent="validatePercentage"
                    ></b-form-input>
                </b-form-group>
                
            </b-row>
            <!-- FORM ACTIONS BUTTONS -->
            <b-button class="mr-2" type="submit" variant="primary">Filtrar</b-button>
        </b-form>
        <!-- END FILTERS FORM -->
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
        <template #cell(use_percentage)="row">
            <!-- EDIT BUTTON -->
            <p>{{row.item.use_percentage}}%</p>
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
    </b-container>
</template>

<script>
    import axios from "axios";

    export default {
        name: "BusesFilterList",
        data(){
            return {
                loading: false,
                alert: false,
                variantalert: 'danger',
                message: '',

                routes:[],
                buses: [],
                fields: [
                    { key: 'num_plate', label: 'Patente'},
                    { key: 'use_percentage', label: 'Porcentaje de uso'}
                ],

                totalRows: 0,
                currentPage: 1,
                perPage: 5,
                pageOptions: [5, 10, 15],

                formfilter:{
                    route: null,
                    percentage: 0
                }
            }
        },
        created() {
            this.getRoutes();
        },
        methods: {
            async filterBus(){
                const route = this.formfilter.route;
                const percentage = this.formfilter.percentage

                try {
                    this.loading = true;
                    const response = await axios.get("trip/buses/use_by_route/?route_id="+route+"&percentage="+percentage);
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
            async getRoutes(){
                try {
                    this.loading = true;
                    const response = await axios.get("trip/routes/");
                    this.routes = response.data;
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al obtener rutas para filtro.';
                    this.variantalert = 'danger';
                } finally {
                    this.loading = false;
                }
            },
            validatePercentage(){
                if(this.percentage < 0 || this.percentage > 100 ){
                    this.percentage = 0;
                }
            }
        }
    }
</script>