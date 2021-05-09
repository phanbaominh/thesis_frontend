<template>
  <v-card>
    <v-tabs v-model="tab" grow class="mb-2">
      <v-tab v-for="item in tabItems" :key="item.text" nuxt :to="item.to">
        {{ item.text }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <nuxt-child keep-alive />
    </v-tabs-items>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  middleware({ $permission, $auth, redirect }) {
    if ($auth.user) {
      if (!$permission.check($permission.PermPermissions)) return redirect('/');
    }
  },
  data() {
    return {
      tab: this.$accessor.permTab,
      tabItems: [
        { text: 'Permissions', to: 'groups' },
        { text: 'Users', to: 'users' },
      ],
    };
  },
  watch: {
    tab() {
      this.$accessor.SET_PERM_TAB(this.tab);
    },
  },
});
</script>
