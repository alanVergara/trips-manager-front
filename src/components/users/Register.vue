<template>
    <form @submit.prevent="registerUser">
        <error v-if="error" :error="error"/>
        <h3>Registro</h3>
        <div class="form-group">
            <label>Nombre Usuario</label>
            <input type="text" class="form-control" v-model="username" placeholder="Nombre Usuario" />
        </div>
        <div class="form-group">
            <label>Contraseña</label>
            <input type="password" class="form-control" v-model="password" placeholder="Contraseña"/>
        </div>
        <div class="form-group">
            <label>Confirmar Contraseña</label>
            <input type="password" class="form-control" v-model="password_confirm" placeholder="Confirmar Contraseña"/>
        </div>
        <button class="btn btn-primary btn-block">Registrarse</button>
    </form>
</template>

<script>
    import axios from 'axios'
    import Error from "../commons/Error";

    export default {
        name:'Register',
        components: {
            Error
        },
        data(){
            return {
                username:'',
                password:'',
                password_confirm:'',
                error:''
            }
        },
        methods : {
            async registerUser(){
                try {
                    const data = {
                        username: this.username,
                        password: this.password,
                        password_confirm: this.password_confirm
                    }
                    await axios.post('user/passengers/', data);

                    this.error = '';
                    this.$router.push('/login');
                } catch (error) {
                    this.error = 'Error al realizar el registro';
                }

            }
        }
    }
</script>