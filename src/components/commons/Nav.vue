<template>
    <nav class="navbar navbar-expand navbar-light fixed-top">
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
    </nav>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "Nav",
    methods: {
        logout() {
            localStorage.removeItem("token");
            this.$store.dispatch("user", null);
            this.$router.push("/");
        },
    },
    computed: {
        ...mapGetters(["user"]),
    },
};
</script>
