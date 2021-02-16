import Vue from "vue"
import VueRouter from "vue-router"

import Main from "./components/trips/Main"
import TripsList from "./components/trips/TripsList"
import RoutesList from "./components/routes/RoutesList"
import DriversList from "./components/drivers/DriversList"

import Login from "./components/users/Login"
import Register from './components/users/Register'

Vue.use(VueRouter);

const routes = [
    {
        path:"/",
        name:"home",
        component:Main
    },
    {
        path:"/login",
        name:"login",
        component:Login
    },
    {
        path:"/register",
        name:"register",
        component:Register
    },
    {
        path:"/drivers",
        name:"drivers",
        component:DriversList
    },
    {
        path:"/trips",
        name:"trips",
        component:TripsList
    },
    {
        path:"/routes",
        name:"routes",
        component:RoutesList
    }
]

const router = new VueRouter({
    mode:'history',
    routes
});

export default router;