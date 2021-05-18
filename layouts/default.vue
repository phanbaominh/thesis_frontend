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
          :disabled="item.disabled"
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
      <v-toolbar-title class="text-h5">TVC Manager</v-toolbar-title>
      <v-spacer></v-spacer>
      <UserMenu class="mr-2" />
      <NotificationMenu />
    </v-app-bar>
    <v-main class="blue lighten-5">
      <v-container fluid class="main-container pt-8">
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { TypeUser } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      drawer: true,
      miniVariant: false,
    };
  },
  computed: {
    adManagerNavItems(): { [key: string]: any }[] {
      return [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/',
          disabled: false,
        },
        {
          icon: 'mdi-cog',
          title: 'Adset',
          to: '/adsets',
          disabled: false,
        },
        {
          icon: 'mdi-folder-multiple-image',
          title: 'Ad Content',
          to:
            this.$accessor.mediaTab === 'playlists'
              ? '/media/playlists'
              : '/media/videos',
          disabled: false,
        },
        {
          icon: 'mdi-billboard',
          title: 'Ad',
          to: '/ads',
          disabled: false,
        },
        {
          icon: 'mdi-chart-line',
          title: 'Analytics',
          to: '/analytics',
          disabled: false,
        },
      ];
    },
    buildingManagerNavItems(): { [key: string]: any }[] {
      return [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/',
          disabled: false,
        },
        {
          icon: 'mdi-cast',
          title: 'Devices',
          to: '/devices',
          disabled: !this.$permission.canGeneralReadDevice(),
        },
        {
          icon: 'mdi-select-group',
          title: 'Zones',
          to: '/zones',
        },
        {
          icon: 'mdi-select-group',
          title: 'Ads',
          to: '/buildingads',
          disabled: !this.$permission.canGeneralReadAd(),
        },
        {
          icon: 'mdi-account-key',
          title: 'Permissions',
          to:
            this.$accessor.permTab === 'users'
              ? '/permissions/users'
              : '/permissions/groups',
          disabled: !this.$permission.check(this.$permission.PermPermissions, {
            isToasting: false,
          }),
        },
      ];
    },
    navItems(): { [key: string]: any }[] {
      if (this.$auth.user && this.$auth.user.typeUser === TypeUser.AdManager) {
        return this.adManagerNavItems;
      } else return this.buildingManagerNavItems;
    },
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
