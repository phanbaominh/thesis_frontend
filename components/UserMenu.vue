<template>
  <div class="text-center">
    <v-menu offset-y>
      <template #activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on">
          <v-avatar>
            <img src="/default-avatar.png" alt="Avatar" />
          </v-avatar>
          Name
        </div>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          nuxt
          dense
        >
          <!-- <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon> -->
          <v-list-item-content>
            <v-list-item-title class="font-weight-regular">{{
              item.title
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data: () => ({
    items: [
      {
        // icon: 'mdi-home',
        title: 'Profile',
        to: '/',
      },
      {
        // icon: 'mdi-cast',
        title: 'Logout',
        to: '/devices',
      },
    ],
  }),
});
</script>
