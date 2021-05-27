<template>
  <v-form
    ref="form"
    v-model="valid"
    :disabled="disabled"
    @submit.prevent="onSubmit"
  >
    <v-card class="pa-4" width="500px">
      <slot name="title"></slot>
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
        :disabled="!!initUser"
        :rules="emailRules"
      ></v-text-field>
      <v-text-field
        v-model="user.desc"
        name="desc"
        label="Desc"
        outlined
        dense
        :rules="[(v) => !!v || 'Description is required']"
      ></v-text-field>
      <v-text-field
        v-if="!initUser"
        v-model="user.password"
        name="password"
        label="Password"
        type="password"
        outlined
        dense
        :rules="passRules"
      ></v-text-field>
      <v-text-field
        v-if="!initUser"
        v-model="repeatPass"
        name="Repeat password"
        label="Repeat password"
        type="password"
        outlined
        dense
        :rules="repeatPassRules"
      ></v-text-field>
      <v-select
        v-if="!initUser"
        v-model="user.typeUser"
        name="typeUser"
        label="User Type"
        outlined
        dense
        :items="typeUsers"
        :disabled="!!defaultUserType"
        :rules="[(v) => !!v || 'User type is required']"
      ></v-select>
      <slot name="append"></slot>
    </v-card>
  </v-form>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Select, TypeUser, User } from '~/types/types';
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export default Vue.extend({
  layout: 'auth',
  auth: false,
  props: {
    initUser: {
      default: null,
      type: Object,
    } as PropOptions<User | null>,
    isNotDialog: {
      default: true,
      type: Boolean,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    defaultUserType: {
      default: null,
      type: String,
    } as PropOptions<string | null>,
  },
  data() {
    return {
      user: {
        typeUser: this.defaultUserType ? this.defaultUserType : '',
        username: '',
        password: '',
        email: '',
        desc: '',
        ...this.initUser,
      } as User,
      repeatPass: '',
      valid: false,
      typeUsers: [
        { text: 'Building Manager', value: TypeUser.BuildingManager },
        { text: 'Ad Manager', value: TypeUser.AdManager },
      ] as Select[],
      emailRules: [
        (v: string) => !!v || 'Email is required',
        (v: string) =>
          (v && emailRegex.test(v)) || 'Email must have correct format',
      ],
      passRules: [
        (v: string) => !!v || 'Password is required',
        (v: string) =>
          (v && v.length >= 8) || 'Password must have at least 8 characters',
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
