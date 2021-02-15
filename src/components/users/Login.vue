<template>
    <form @submit.prevent="loginUser">
        <error v-if="error" :error="error"/>
        <h3>Inicio Sesión</h3>
        <div class="form-group">
            <label>Nombre Usuario</label>
            <input type="text" class="form-control" v-model="username" placeholder="Nombre Usuario"/>
        </div>
        <div class="form-group">
            <label>Contraseña</label>
            <input type="password" class="form-control" v-model="password" placeholder="Contraseña"/>
        </div>
        <button class="btn btn-primary btn-block">Iniciar Sesión</button>
    </form>
</template>

<script>
    import axios from "axios";
    import Error from "../commons/Error";

    export default {
        name:'Login',
        components: {
            Error
        },
        data(){
            return {
                username: '',
                password: '',
                error: ''
            }
        },
        methods:{
            async loginUser(){
                try {
                    const data = {
                        username: this.username,
                        password: this.password
                    }
                    const response = await axios.post('user/passengers/login/', data);

                    localStorage.setItem('token', response.data.token);
                    this.$store.dispatch('user', response.data.user);
                    this.error = '';
                    this.$router.push('/trips');
                } catch (error) {
                    this.error = 'Usuario o Contraseña invalido';   
                }
            }
        }
    }
</script>