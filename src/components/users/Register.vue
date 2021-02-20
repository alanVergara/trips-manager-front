<template>
    <b-container>
        <form @submit.prevent="registerUser" class="col-6">
            <!-- MESSAGE -->
            <b-alert :show="alert" dismissible :variant="variantalert">{{message}}</b-alert>
            <h3 class="my-4">{{ user ? 'Actualizar datos' : 'Registro'}}</h3>
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
            <button v-if="!user" type="submit" class="btn btn-primary btn-block">Registrarse</button>
            <button v-if="user" class="btn btn-primary btn-block" @click="updateUser()">Actualizar</button>
        </form>
    </b-container>
</template>

<script>
    import axios from 'axios';
    import { mapGetters } from "vuex";

    export default {
        name:'Register',
        computed: {
            ...mapGetters(["user"]),
        },
        data(){
            return {
                alert: false,
                variantalert: 'danger',
                message: '',

                username:'',
                password:'',
                password_confirm:'',
            }
        },
        created() {
            this.setDefaultValues();
        },
        methods : {
            /**
             * Register new user
             */
            async registerUser(){
                try {
                    if(!this.user){
                        const data = {
                            username: this.username,
                            password: this.password,
                            password_confirm: this.password_confirm
                        }
                        await axios.post('user/passengers/', data);
                        this.$router.push('/login');
                    }
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al realizar el registro.';
                    this.variantalert = 'danger';
                }

            },
            /**
             * Update data from user
             */
            async updateUser(){
                try {
                    const data = {
                        username: this.username,
                        password: this.password,
                        password_confirm: this.password_confirm
                    }

                    if(this.user && this.user.user_type && this.user.user_type==2){
                        await axios.put("user/passengers/"+this.user.id+"/", data);
                    }else if(this.user && this.user.user_type && this.user.user_type==3){
                        await axios.put("user/drivers/"+this.user.id+"/", data);
                    }
                    
                    this.alert = true;
                    this.message = 'Datos actualizados correctamente.';
                    this.variantalert = 'success';
                } catch (error) {
                    this.alert = true;
                    this.message = 'Error al realizar la actualización de datos.';
                    this.variantalert = 'danger';
                }
            },
            setDefaultValues(){
                if(this.user && this.user.username){
                    this.username = this.user.username;
                }
            }
        }
    }
</script>