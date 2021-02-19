<template>
  <v-app>
    <Nav/>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
  import Nav from './components/commons/Nav.vue';

  export default {
    name: "App",
    components: {
      Nav,
    }
  };
</script>

<style>
  a:link {
    text-decoration: none;
  }
</style>
