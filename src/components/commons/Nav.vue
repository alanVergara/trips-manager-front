<template>
    <nav class="navbar navbar-expand navbar-light fixed-top">
        <div class="container">
            <router-link to="/" class="navbar-brand">Home</router-link>
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
