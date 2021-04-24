<template>
  <div class="text-center">
    <v-menu offset-y>
      <template #activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on">
          <v-avatar>
            <img src="/default-avatar.png" alt="Avatar" />
          </v-avatar>
          <span v-if="!$vuetify.breakpoint.xs">{{
            $auth.user ? $auth.user.username : 'None'
          }}</span>
        </div>
      </template>
      <v-list>
        <v-list-item to="/" nuxt dense>
          <!-- <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon> -->
          <v-list-item-content>
            <v-list-item-title class="font-weight-regular">
              Profile
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item dense @click="onLogout">
          <!-- <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon> -->
          <v-list-item-content>
            <v-list-item-title class="font-weight-regular">
              Log out
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data: () => ({}),
  methods: {
    async onLogout() {
      await this.$auth.logout();
      this.$accessor.DELETE_USER();
      this.$router.push('/login');
    },
  },
});
</script>
