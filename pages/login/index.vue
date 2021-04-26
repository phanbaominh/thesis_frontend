<template>
  <v-form v-model="valid" class="d-flex justify-center">
    <v-card class="pa-4" width="500px">
      <v-card-title>Sign in</v-card-title>
      <v-text-field
        v-model="login.email"
        name="email"
        label="Email"
        outlined
        dense
      ></v-text-field>
      <v-text-field
        v-model="login.password"
        name="password"
        label="Password"
        type="password"
        outlined
        dense
      ></v-text-field>
      <BaseDialogActions @close="isUploadDialog = false" @confirm="onSignIn">
        Sign in
      </BaseDialogActions>
      <div>
        <nuxt-link to="/signup">Don't have an account? Sign up</nuxt-link>
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
      login: {
        email: '',
        password: '',
      },
      valid: false,
    };
  },
  methods: {
    async onSignIn() {
      // const response = await this.$auth.loginWith('local', {
      //   data: this.login,
      // });
      // if (!response)
      //   this.$nuxt.error({
      //     message: 'Internal Server error',
      //     statusCode: 500,
      //   });
      // else {
      //   console.log(response);
      //   this.$accessor.SET_USER(response.data.user);
      //   this.$router.push('/');
      // }
      await this.$auth
        .loginWith('local', {
          data: this.login,
        })
        .catch((err) => console.log('inside', err));
      this.$router.push('/');
    },
  },
});
</script>
