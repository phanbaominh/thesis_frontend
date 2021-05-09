<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Fetching permission groups... </template>
    <DataIterator
      :type="'Permission Groups'"
      :init-items="permGroups"
      :compact="false"
    >
      <PermGroupCreateForm @submit="onNew" />
      <template #main="{ items: displayedPermGroups }">
        <v-row class="mt-2">
          <v-col
            v-for="permGroup in displayedPermGroups"
            :key="permGroup._id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <PermDialog
              :control-dialog="dialog"
              :init-perm-group="permGroup"
              @delete="onDelete(permGroup)"
            />
          </v-col>
        </v-row>
      </template>
    </DataIterator>
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { PermissionGroup } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      dialog: true,
    };
  },
  async fetch() {
    await this.$accessor.setAllPermGroups();
  },
  computed: {
    permGroups() {
      return this.$accessor.allPermGroups;
    },
  },
  methods: {
    async onNew({ name, desc }: { name: string; desc: string }) {
      try {
        const newPermGroup = (
          await this.$axios.$post(this.$apiUrl.permGroups, { name, desc })
        ).permGroup;

        this.$accessor.ADD_TO_PERM_GROUPS(newPermGroup);
      } catch {
        // do nothing
      }
    },
    async onDelete(permGroup: PermissionGroup) {
      try {
        await this.$axios.$delete(this.$apiUrl.permGroup(permGroup._id));
        this.$accessor.DELETE_FROM_PERM_GROUPS([permGroup._id]);
      } catch {
        // do nothing
      }
    },
  },
});
</script>
