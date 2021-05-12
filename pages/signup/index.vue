<template>
  <UserForm @submit="onSignUp">
    <template #title><v-card-title>Sign up</v-card-title></template>
    <template #append>
      <BaseSubmitActions is-not-dialog> Sign up </BaseSubmitActions>
      <div>
        <nuxt-link to="/login">Already have an account? Log in</nuxt-link>
      </div>
    </template>
  </UserForm>
</template>
<script lang="ts">
import Vue from 'vue';
import { User } from '~/types/types';
export default Vue.extend({
  auth: false,
  layout: 'auth',
  methods: {
    async onSignUp(user: User) {
      await this.$handleErrors(async () => {
        await this.$axios.$post(`${this.$apiUrl.user}/sign-up`, {
          ...user,
        });
        await this.$auth.loginWith('local', { data: { ...user } });
        this.$router.push('/');
      });
    },
  },
});
</script>
