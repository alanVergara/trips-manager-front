<template>
    <!-- <nav class="navbar navbar-expand navbar-light fixed-top">
        <div class="container">
            <router-link to="/" class="navbar-brand">Home</router-link>
            <b-row>
                <router-link to="/routes" class="nav-link">Rutas</router-link>
                <router-link to="/buses" class="nav-link">Buses</router-link>
                <router-link to="/drivers" class="nav-link">Conductores</router-link>
            </b-row>
            <b-row class="ml-2">
                <router-link to="/trips" class="nav-link">Viajes</router-link>
                <router-link to="/tickets" class="nav-link">Tickets</router-link>
            </b-row>
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav ml-auto" v-if="!user">
                    <li class="nav-item">
                        <router-link to="/login" class="nav-link">Iniciar Sesión</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/register" class="nav-link">Registro</router-link>
                    </li>
                </ul>
                <ul class="navbar-nav ml-auto" v-if="user">
                    <li class="nav-item">
                        <a href="javascript:void(0)" @click="logout" class="nav-link">Cerrar Sesión</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav> -->
    <b-navbar toggleable="lg" type="dark" variant="primary">
        <router-link to="/" class="navbar-brand">Home</router-link>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav v-if="user && user.user_type == 1">
                <router-link to="/routes" class="nav-link">Rutas</router-link>
                <router-link to="/buses" class="nav-link">Buses</router-link>
                <router-link to="/drivers" class="nav-link">Conductores</router-link>
            </b-navbar-nav>
            <b-navbar-nav>
                <router-link to="/" class="nav-link">Viajes</router-link>
                <router-link to="/tickets" class="nav-link" v-if="user && user.user_type == 2">Tickets</router-link>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <router-link to="/login" class="nav-link" v-if="!user">Iniciar Sesión</router-link>
                <router-link to="/register" class="nav-link" v-if="!user">Registro</router-link>

                <b-nav-item-dropdown right v-if="user">
                    <template #button-content>
                        <em>{{user.username}}</em>
                    </template>
                    <router-link to="/register" v-if="user.user_type == 2 || user.user_type == 3">Editar</router-link>
                    <li class="nav-item" v-if="user.user_type == 2">
                        <a href="javascript:void(0)" @click="deleteModalUser">Borrar</a>
                    </li>
                    <li class="nav-item">
                        <a href="javascript:void(0)" @click="logout">Cerrar Sesión</a>
                    </li>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
        <b-alert :show="alert" dismissible :variant="variantalert">{{message}}</b-alert>
        <!-- INIT MODAL DELETE -->
        <b-modal
            id="user-delete"
            ref="modal"
            title="Borrar Usuario"
            ok-title="Borrar"
            header-close-label="Cerrar"
            @ok="deleteUser"
        >
            <p>Esta seguro que desea borrar el usuario: {{user ? user.username : ''}}</p>
        </b-modal>
        <!-- END MODAL DELETE -->
    </b-navbar>
</template>

<script>
    import { mapGetters } from "vuex";
    import axios from "axios";

    export default {
        name: "Nav",
        data() {
            return {
                loading: false,
                alert: false,
                variantalert: 'danger',
                message: '',

                userToDelete: null
            }
        },
        methods: {
            logout() {
                localStorage.removeItem("token");
                this.$store.dispatch("user", null);
                if (this.$route.path !== '/'){
                    this.$router.push('/');
                }
            },
            deleteModalUser(){
                this.$bvModal.show('user-delete');
                this.userToDelete = this.user;
            },
            /**
             * Function for delete user
             */
            async deleteUser(){
                try {
                    this.loading = true;
                    await axios.delete("user/passengers/"+this.userToDelete.id);
                    this.alert = true;
                    this.message = 'Usuario eliminado correctamente.';
                    this.variantalert = 'success';
                    this.logout();
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al borrar el usuario.';
                    this.variantalert = 'danger';
                } finally {
                    this.loading = false;
                }
            }
        },
        computed: {
            ...mapGetters(["user"]),
        },
    };
</script>
