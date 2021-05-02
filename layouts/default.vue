<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      app
      fixed
      :mini-variant="miniVariant"
      width="150"
    >
      <v-list nav>
        <v-list-item
          v-for="(item, i) in navItems"
          :key="i"
          :to="item.to"
          nuxt
          dense
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="font-weight-regular">{{
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
      <v-toolbar-title class="text-h5">Project Name</v-toolbar-title>
      <v-spacer></v-spacer>
      <UserMenu />
    </v-app-bar>
    <v-main class="blue lighten-5">
      <v-container class="main-container pt-8">
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
        {
          icon: 'mdi-account-key',
          title: 'Permissions',
          to: '/permissions',
        },
      ],
      drawer: true,
      miniVariant: false,
    };
  },
});
</script>

<style>
.main-container {
  display: flex;
  height: 100%;
}
.main-container > * {
  width: 100%;
}

.custom-container {
  margin-left: auto;
  width: 90%;
  margin-right: auto;
  padding-top: 32px;
}

.custom-toast-container {
  top: 0% !important;
  right: 0% !important;
}

.custom-toast-content {
  font-size: 1em !important;
}
</style>
