<template>
  <v-form v-model="valid">
    <v-card class="pa-4" width="500px">
      <v-card-title>Profile</v-card-title>
      <v-text-field
        v-model="user.username"
        name="username"
        label="Name"
        outlined
        dense
      ></v-text-field>
      <v-text-field
        v-model="user.email"
        name="email"
        label="Email"
        outlined
        dense
      ></v-text-field>
      <v-text-field
        v-model="user.password"
        name="password"
        label="New password"
        type="password"
        outlined
        dense
      ></v-text-field>
      <BaseDialogActions @confirm="onUpdate">
        Update profile
      </BaseDialogActions>
    </v-card>
  </v-form>
</template>
<script lang="ts">
import Vue from 'vue';
import { User } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      user: ({ ...this.$auth.user } as unknown) as User,
      valid: false,
    };
  },
  head: {
    title: 'Settings',
  },
  methods: {
    async onUpdate() {
      // this.$accessor.SET_USER(
      //   (await this.$axios.$put(this.$apiUrl.user, { user: this.user })).user
      // );
      await this.$axios.$put(this.$apiUrl.user, { user: this.user });
      await this.$auth.fetchUser();
      this.$toast.success('Successfully update your profile');
    },
  },
});
</script>
