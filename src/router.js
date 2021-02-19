import Vue from "vue"
import VueRouter from "vue-router"

import TripsList from "./components/trips/TripsList"
import RoutesList from "./components/routes/RoutesList"
import DriversList from "./components/drivers/DriversList"
import BusesTabs from "./components/buses/BusesTabs";
import TicketsReservation from "./components/tickets/TicketsReservation"

import Login from "./components/users/Login"
import Register from './components/users/Register'

Vue.use(VueRouter);

const routes = [
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
        path:"/",
        name:"trips",
        component:TripsList
    },
    {
        path:"/routes",
        name:"routes",
        component:RoutesList
    },
    {
        path:"/buses",
        name:"buses",
        component:BusesTabs
    },
    {
        path:"/tickets",
        name:"tickets",
        component:TicketsReservation,
        props: true
    }
]

const router = new VueRouter({
    mode:'history',
    routes
});

export default router;