<template>
  <v-form v-model="valid" class="d-flex justify-center">
    <v-card class="pa-4" width="500px">
      <v-card-title>Sign up</v-card-title>
      <v-text-field
        v-model="user.username"
        name="username"
        label="Username"
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
        label="Password"
        type="password"
        outlined
        dense
      ></v-text-field>
      <BaseDialogActions @confirm="onSignUp"> Sign up </BaseDialogActions>
      <div>
        <nuxt-link to="/login">Already have an account? Log in</nuxt-link>
      </div>
    </v-card>
  </v-form>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  layout: 'auth',
  auth: false,
  data() {
    return {
      user: {} as { email?: string; password?: string; username?: string },
      valid: false,
    };
  },
  methods: {
    async onSignUp() {
      await this.$axios.$post(`${this.$apiUrl.user}/sign-up`, {
        ...this.user,
      });
      await this.$auth.loginWith('local', { data: { ...this.user } });
      this.$router.push('/');
    },
  },
});
</script>
