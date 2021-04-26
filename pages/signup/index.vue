<template>
  <UserForm @submit="onSignUp" />
</template>
<script lang="ts">
import Vue from 'vue';
import { User } from '~/types/types';
export default Vue.extend({
  auth: false,
  layout: 'auth',
  methods: {
    async onSignUp(user: User) {
      try {
        await this.$axios.$post(`${this.$apiUrl.user}/sign-up`, {
          ...user,
        });
        await this.$auth.loginWith('local', { data: { ...user } });
        this.$router.push('/');
      } catch {
        // do nothing
      }
    },
  },
});
</script>
