<template>
  <BaseDialogForm
    title="Add permission:"
    :action="`${$apiUrl}/permissions`"
    :control-dialog="dialog"
    :icon="icon"
    :max-width="400"
    @submit="onAddPermission"
  >
    <template #activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <BaseFetcher :fetch-state="$fetchState">
      <template #pending>Fetching users, permissions...</template>
      <v-select
        v-model="selectedUser"
        name="user"
        label="User"
        outlined
        dense
        :items="users"
        hint="Pick user to be granted permissions"
        persistent-hint
        :rules="[(v) => !!v || 'User is required']"
      >
      </v-select>
      <v-select
        v-model="selectedPerms"
        name="permissions"
        label="Permissions"
        outlined
        dense
        :items="perms"
        :menu-props="{ maxHeight: '400' }"
        multiple
        hint="Pick permissions to grant user"
        persistent-hint
        :rules="[(v) => v.length > 0 || 'Permission is required']"
      >
      </v-select>
    </BaseFetcher>
  </BaseDialogForm>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    icon: {
      default: 'plus',
      type: String,
    },
  },
  data() {
    return {
      dialog: true,
      selectedPerms: [],
      selectedUser: null,
      perms: ['perm1', 'perm2'],
      users: ['user1'],
    };
  },
  async fetch() {
    await Promise.resolve();
  },
  methods: {
    async onAddPermission() {
      await Promise.resolve();
      this.dialog = !this.dialog;
      this.selectedPerms = [];
      this.selectedUser = null;
    },
  },
});
</script>
