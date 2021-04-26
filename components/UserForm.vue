<template>
  <v-form
    ref="form"
    v-model="valid"
    class="d-flex justify-center"
    @submit.prevent="onSubmit"
  >
    <v-card class="pa-4" width="500px">
      <v-card-title>Sign up</v-card-title>
      <v-text-field
        v-model="user.username"
        name="username"
        label="Username"
        outlined
        dense
        :rules="[(v) => !!v || 'Username is required']"
      ></v-text-field>
      <v-text-field
        v-model="user.email"
        name="email"
        label="Email"
        outlined
        dense
        :rules="emailRules"
      ></v-text-field>
      <v-text-field
        v-model="user.password"
        name="password"
        label="Password"
        type="password"
        outlined
        dense
        :rules="passRules"
      ></v-text-field>
      <v-text-field
        v-model="repeatPass"
        name="Repeat password"
        label="Repeat password"
        type="password"
        outlined
        dense
        :rules="repeatPassRules"
      ></v-text-field>
      <BaseSubmitActions is-not-dialog>
        {{ isUpdate ? 'Update Profile' : 'Sign up' }}
      </BaseSubmitActions>
      <div v-if="!isUpdate">
        <nuxt-link to="/login">Already have an account? Log in</nuxt-link>
      </div>
    </v-card>
  </v-form>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { User } from '~/types/types';
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export default Vue.extend({
  layout: 'auth',
  auth: false,
  props: {
    initUser: {
      default: () => ({ username: '', email: '', password: '' }),
      type: Object,
    } as PropOptions<User>,
    isUpdate: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      user: { ...this.initUser },
      repeatPass: '',
      valid: false,
      emailRules: [
        (v: string) => !!v || 'Email is required',
        (v: string) =>
          (v && emailRegex.test(v)) || 'Email must have correct format',
      ],
      passRules: [
        (v: string) => !!v || 'Password is required',
        (v: string) =>
          this.isUpdate ||
          (v && v.length >= 8) ||
          'Password must have at least 8 characters',
      ],
    };
  },
  computed: {
    repeatPassRules(): any[] {
      return [
        (v: string) => !!v || 'Repeat password is required',
        (v: string) => v === this.user.password || 'Password is not the same',
      ];
    },
  },
  watch: {
    'user.password'() {
      if (this.repeatPass.length > 0) (this.$refs.form as any).validate();
    },
  },
  methods: {
    onSubmit() {
      if (!(this.$refs.form as any).validate()) return;
      this.$emit('submit', this.user);
    },
  },
});
</script>
