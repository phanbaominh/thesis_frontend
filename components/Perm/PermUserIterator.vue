<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Fetching permissions... </template>
    <DataIterator :type="'Users'" :init-items="users" :compact="false">
      <PermUserCreateDialog @newUser="onNewUser" />
      <template #main="{ items: displayedUsers }">
        <v-row class="mt-2">
          <v-col
            v-for="user in displayedUsers"
            :key="user._id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <PermUserDialog :init-user="user" @delete="onDelete(user)" />
          </v-col>
        </v-row>
      </template>
    </DataIterator>
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { Subuser } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      users: [] as Subuser[],
    };
  },
  async fetch() {
    this.users = (await this.$axios.$get(this.$apiUrl.subusers)).subusers;
    // console.log(
    //   (await this.$axios.$get(this.$apiUrl.userPermSubuser(this.users[0]._id)))
    //     .userPermissions
    // );
  },
  methods: {
    onNewUser(user: Subuser) {
      this.users.push(user);
    },
    async onDelete(user: Subuser) {
      try {
        await this.$axios.$delete(this.$apiUrl.subuser(user._id));
        this.users = this.users.filter((u) => u._id !== user._id);
      } catch {
        // do nothing
      }
    },
  },
});
</script>
