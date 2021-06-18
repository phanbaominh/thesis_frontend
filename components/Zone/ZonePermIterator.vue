<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Fetching permissions... </template>
    <BaseDataIterator
      v-if="$vuetify.breakpoint.smAndUp"
      type="Granted Permissions"
      :items="userPerms"
      compact
      read-only
    >
      <template #headers>
        <v-list-item>
          <v-list-item-content
            class="text-subtitle-1 font-weight-bold text-sm-h6"
          >
            <v-row>
              <v-col cols="3">User</v-col>
              <v-divider vertical></v-divider>
              <v-col cols="6">Permissions</v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </template>
      <template #default="{ item: userPerm }">
        <v-col cols="3"> {{ userPerm.user.username }}</v-col>
        <v-divider vertical></v-divider>
        <v-col cols="6">
          {{ listOfPermissionGroup(userPerm) }}
        </v-col>
      </template>
    </BaseDataIterator>
    <DataIterator v-else type="User-Perms" :init-items="userPerms" compact>
      <template #main="{ items: displayedUserPerms }">
        <v-row class="mt-2">
          <v-col
            v-for="userPerm in displayedUserPerms"
            :key="userPerm.user"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-card-title class="text-subtitle-1">
                {{ userPerm.user.username }}

                <v-spacer></v-spacer>
                <div class="mr-2"></div>
                <!-- <DialogDelete
                  v-slot="{ on, attrs }"
                  @delete="$emit('delete')"
                  @click.prevent
                >
                  <v-btn
                    color="error"
                    x-small
                    fab
                    depressed
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </DialogDelete> -->
              </v-card-title>

              <v-divider></v-divider>
              <v-card-text>
                Permissions: {{ listOfPermissionGroup(userPerm) }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </DataIterator>
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { SubuserPermissionGroup } from '~/types/types';
export default Vue.extend({
  props: {
    zoneId: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      userPerms: [] as SubuserPermissionGroup[],
    };
  },
  async fetch() {
    this.userPerms = (
      await this.$axios.$get(this.$apiUrl.userPermZone(this.zoneId))
    ).userPermissions;
  },
  methods: {
    listOfPermissionGroup(userPerm: SubuserPermissionGroup) {
      return userPerm.permissionGroups.map((pg) => pg.name).join(', ');
    },
    onAddUser() {},
  },
});
</script>
