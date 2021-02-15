<template>
    <v-navigation-drawer permanent absolute expand-on-hover>
      <v-list>
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img
              src="https://randomuser.me/api/portraits/women/85.jpg"
            ></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="title">
              Viajapp
            </v-list-item-title>
            <v-list-item-subtitle>username</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav dense>
        <div v-for="item in menu" :key="item.name">
          <router-link :to="item.route">
            <v-list-item link>
              <v-list-item-icon>
                <v-icon>{{item.icon}}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{item.name}}
              </v-list-item-title>
            </v-list-item>
          </router-link>
        </div>
      </v-list>
    </v-navigation-drawer>
</template>

<script>
    export default {
        name:"Menu",
        data(){
            return{
                menu:[
                    {route:"/", name:"Inicio", icon:"mdi-folder"}
                ]
            }
        }
    }
</script>