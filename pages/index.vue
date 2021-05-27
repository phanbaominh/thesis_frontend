<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <UserProfile
          :disabled="!!($auth.user && $auth.user.adminId)"
          class="mb-4"
        />
      </v-col>
      <v-col v-if="$permission.canGeneralReadAnalytics()" cols="6">
        <HomeSummary
          v-if="isAdManager"
          :link="$apiUrl.analyticsSummary"
          class="mb-4"
        />
        <HomeSummary
          v-else
          :link="$apiUrl.bdAnalyticsSummary"
          class="mb-4"
          cost-name="Profit"
        />
      </v-col>
    </v-row>
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
