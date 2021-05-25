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
  middleware: [
    'checkUserIsAdManager',
    // ({ $permission, $auth, redirect }) => {
    //   if ($auth.user) {
    //     if (!$permission.check($permission.MediaPermissions))
    //       return redirect('/');
    //   }
    // },
  ],
  data() {
    return {
      tab: this.$accessor.mediaTab,
      tabItems: [
        { text: 'Videos', to: 'videos' },
        { text: 'Playlists', to: 'playlists' },
      ],
    };
  },
  watch: {
    tab() {
      this.$accessor.SET_MEDIA_TAB(this.tab);
    },
  },
});
</script>
