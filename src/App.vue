<template>
  <v-app>
    <Nav/>
    <!-- <Menu/> -->
    <v-main class="ml-14 mt-14">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
  import Nav from './components/commons/Nav.vue';
//   import Menu from './components/commons/Menu.vue'

  export default {
    name: "App",
    components: {
      Nav,
    //   Menu
    }
  };
</script>

<style>
  a:link {
    text-decoration: none;
  }
</style>
