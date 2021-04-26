<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Fetching permissions... </template>
    <BaseDataIterator :items="perms" type="Permission">
      <template #default="{ item }">
        <v-col cols="3">
          <PermDialog :name="item.name" :items="zoneUsers"
        /></v-col>
        <v-col cols="6"> {{ item.desc }}</v-col>
      </template>
    </BaseDataIterator>
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { Permission } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      perms: [] as Permission[],
      zoneUsers: [
        {
          zone: 'cool',
          users: ['user1', 'user2'],
        },
      ],
    };
  },
  async fetch() {
    await Promise.resolve(0);
    this.perms = [
      {
        _id: '1',
        name: 'perm1',
        desc:
          'long long long  long long long long long long long long long long long long long long long',
      },
    ];
    console.log(this.perms);
  },
});
</script>
