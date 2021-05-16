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
  computed: {
    isAdManager() {
      return this.$auth.user && this.$auth.user.typeUser === TypeUser.AdManager;
    },
  },
});
</script>
