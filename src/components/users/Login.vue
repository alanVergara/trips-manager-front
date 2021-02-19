<template>
    <b-container>
        <form @submit.prevent="loginUser" class="col-6">
            <b-alert :show="alert" dismissible :variant="variantalert">{{message}}</b-alert>
            <h3 class="my-4">Inicio Sesión</h3>
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
    </b-container>
</template>

<script>
    import axios from "axios";

    export default {
        name:'Login',
        data(){
            return {
                alert: false,
                variantalert: 'danger',
                message: '',

                username: '',
                password: '',
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
                    this.$router.push('/');
                } catch (error) {
                    this.alert = true;
                    this.message = 'Usuario o Contraseña invalido.';
                    this.variantalert = 'danger';
                }
            }
        }
    }
</script>