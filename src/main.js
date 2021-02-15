import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import Vuetify from "vuetify"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from "bootstrap-vue"
import router from "./router"
import "./axios"
import store from './vuex'

Vue.use(Vuetify);
Vue.use(BootstrapVue);

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
