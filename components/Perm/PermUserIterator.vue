<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Fetching permissions... </template>
    <BaseDataIterator type="Users" :items="users">
      <template #toolbar>
        <DialogName init-name="" title="Add user:" @updateName="onAddUser" />
      </template>
      <template #default="{ item: user }">
        <v-col> {{ user }}</v-col>
      </template></BaseDataIterator
    >
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      users: ['user1@mail.com', 'user2@mail.com'],
    };
  },
  async fetch() {
    await Promise.resolve();
  },
  methods: {
    onAddUser() {},
  },
});
</script>
