<template>
  <v-form
    ref="form"
    v-model="valid"
    class="d-flex justify-center"
    @submit.prevent="onSignIn"
  >
    <v-card class="pa-4" width="500px">
      <v-card-title>Sign in</v-card-title>
      <v-text-field
        v-model="login.email"
        name="email"
        label="Email"
        outlined
        dense
        :rules="[(v) => !!v || 'Email is required']"
      ></v-text-field>
      <v-text-field
        v-model="login.password"
        name="password"
        label="Password"
        type="password"
        outlined
        dense
        :rules="[(v) => !!v || 'Password is required']"
      ></v-text-field>
      <BaseSubmitActions is-not-dialog @close="isUploadDialog = false">
        Sign in
      </BaseSubmitActions>
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
      if (!(this.$refs.form as any).validate()) return;
      await this.$handleErrors(async () => {
        await this.$auth.loginWith('local', {
          data: this.login,
        });
        this.$socket.emit('auth', {
          token: (this.$auth.strategy as any).token.get().split(' ')[1],
        });
        this.$router.push('/');
      });
    },
  },
});
</script>
