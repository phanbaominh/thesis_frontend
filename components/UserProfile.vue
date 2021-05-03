<template>
  <UserForm
    v-if="$auth.user"
    is-update
    :init-user="$auth.user"
    @submit="onUpdate"
  >
    <template #append>
      <BaseSubmitActions is-not-dialog> Update profile </BaseSubmitActions>
    </template>

    <template #title> <v-card-title>Profile</v-card-title> </template>
  </UserForm>
</template>
<script lang="ts">
import Vue from 'vue';
import { User } from '~/types/types';
export default Vue.extend({
  methods: {
    async onUpdate(user: User) {
      // this.$accessor.SET_USER(
      //   (await this.$axios.$put(this.$apiUrl.user, { user: this.user })).user
      // );
      try {
        await this.$axios.$put(this.$apiUrl.user, { user });
        await this.$auth.fetchUser();
        this.$toast.success('Successfully update your profile');
      } catch {
        // DO NOTHING
      }
    },
  },
});
</script>
