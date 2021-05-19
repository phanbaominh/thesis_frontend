<template>
  <v-container>
    <UserProfile
      :disabled="!!($auth.user && $auth.user.adminId)"
      class="mb-4"
    />
    <HomeAdManager v-if="isAdManager" />
    <HomeBdManager v-else />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { TypeUser } from '~/types/types';
export default Vue.extend({
  head() {
    return {
      meta: (this as any).isAdManager
        ? [{ hid: 'viewport', name: 'viewport', content: 'width=1080' }]
        : [],
    };
  },
  computed: {
    isAdManager(): boolean {
      return !!(
        this.$auth.user && this.$auth.user.typeUser === TypeUser.AdManager
      );
    },
  },
});
</script>
