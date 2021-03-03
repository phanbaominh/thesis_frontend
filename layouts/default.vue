<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      app
      fixed
      :mini-variant="miniVariant"
    >
      <v-list nav>
        <v-list-item v-for="(item, i) in navItems" :key="i" :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-md-h6 font-weight-regular">{{
              item.title
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar clipped-left app fixed>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        v-if="$vuetify.breakpoint.lgAndUp"
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title>Project Name</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      navItems: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/',
        },
        {
          icon: 'mdi-cast',
          title: 'Devices',
          to: '/devices',
        },
        {
          icon: 'mdi-select-group',
          title: 'Zones',
          to: '/zones',
        },
        {
          icon: 'mdi-folder',
          title: 'Media',
          to: '/media',
        },
      ],
      drawer: true,
      miniVariant: false,
    };
  },
});
</script>
