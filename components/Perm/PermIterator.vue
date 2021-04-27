<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Fetching permissions... </template>
    <DataIterator :type="'Playlist'" :init-items="perms" :compact="false">
      <DialogName
        v-slot="{ on, attrs }"
        init-name=""
        title="Create a permission:"
        @updateName="onNew"
      >
        <v-btn
          depressed
          fab
          :color="'blue'"
          class="align-self-center mr-2"
          :small="!$vuetify.breakpoint.xs"
          :x-small="$vuetify.breakpoint.xs"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </DialogName>
      <template #main="{ items: displayedPerms }">
        <v-row class="mt-2">
          <v-col
            v-for="perm in displayedPerms"
            :key="perm._id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <PermDialog :perm="perm" />
          </v-col>
        </v-row>
      </template>
    </DataIterator>
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { Permission } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      perms: [] as Permission[],
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
  methods: {
    async onNew() {},
    async onDelete() {},
  },
});
</script>
