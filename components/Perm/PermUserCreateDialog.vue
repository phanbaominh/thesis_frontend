<template>
  <v-dialog
    v-model="dialog"
    max-width="350"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    :hide-overlay="$vuetify.breakpoint.smAndDown"
  >
    <template #activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs">
        <v-btn
          depressed
          fab
          :color="'blue'"
          class="align-self-center mr-2"
          :small="!$vuetify.breakpoint.xs"
          :x-small="$vuetify.breakpoint.xs"
          v-bind="attrs"
          dark
          v-on="on"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </slot>
    </template>
    <v-card>
      <UserForm :default-user-type="defaultUserType" @submit="onCreateUser">
        <template #title
          ><BaseDialogTitle @close="dialog = false">
            Create User
          </BaseDialogTitle>
        </template>
        <template #append>
          <BaseSubmitActions @close="dialog = false">
            Confirm <template #close> Close </template>
          </BaseSubmitActions>
        </template>
      </UserForm>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue from 'vue';
import { TypeUser, User } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      dialog: false,
      defaultUserType: TypeUser.BuildingManager,
    };
  },
  methods: {
    async onCreateUser(user: User) {
      await this.$handleErrors(async () => {
        if (!this.$auth.user) return;
        const newSubuser = {
          ...user,
          admin: this.$auth.user._id,
        };
        const newUser = (
          await this.$axios.$post(`${this.$apiUrl.subusers}`, newSubuser)
        ).user;
        this.dialog = false;
        this.$toasted.success('Successfully created new user');
        this.$emit('newUser', newUser);
      });
    },
  },
});
</script>
