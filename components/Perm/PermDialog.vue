<template>
  <v-dialog
    v-model="dialog"
    width="1000"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    :hide-overlay="$vuetify.breakpoint.smAndDown"
  >
    <template #activator="{ on, attrs }">
      <v-card v-bind="attrs" v-on="on">
        <v-card-title class="subheading font-weight-bold"
          >{{ permGroup.name }}
          <v-spacer></v-spacer>
          <DialogDelete
            v-if="!isAdmin"
            v-slot="{ on: on2, attrs: attrs2 }"
            @delete="$emit('delete')"
            @click.prevent
          >
            <v-btn
              color="error"
              x-small
              fab
              depressed
              v-bind="attrs2"
              v-on="on2"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </DialogDelete>
        </v-card-title>
        <v-spacer></v-spacer>
        <!-- <v-btn class="mr-2" color="primary" x-small fab depressed>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn> -->

        <v-divider></v-divider>
        <v-card-text>
          {{ permGroup.desc }}
        </v-card-text>
      </v-card>
    </template>
    <v-card class="pa-4">
      <BaseDialogTitle @close="dialog = false">
        Permission Group:
      </BaseDialogTitle>
      <v-row class="mb-4">
        <v-col cols="12" sm="4">
          <v-card class="pa-4">
            <PermGroupUpdateForm
              :perm-group="permGroup"
              :disabled="isAdmin"
              @submit="onUpdatePermGroup"
            />
          </v-card>
        </v-col>
        <v-col cols="12" sm="8">
          <v-card>
            <v-toolbar dark color="blue darken-3" class="mb-1" flat>
              <v-row class="text-subtitle-1 text-sm-h6">
                <v-col cols="5">Scope</v-col>
                <v-col>Permission</v-col>
              </v-row>
            </v-toolbar>
            <v-tabs v-model="tab" vertical>
              <div class="perm-tabs">
                <v-tab v-for="item in tabItems" :key="item">
                  {{ item }}
                </v-tab>
              </div>
              <v-tabs-items v-model="tab">
                <v-tab-item v-for="(permTabItem, i) in permTabItems" :key="i">
                  <PermTabItem
                    :perm-tab-item="permTabItem"
                    :disabled="isAdmin"
                  />
                </v-tab-item>
              </v-tabs-items>
            </v-tabs>
          </v-card>
        </v-col>
      </v-row>
      <v-card class="zone-user-card">
        <PermDialogTable
          v-if="!isAdmin"
          :perm-group-id="permGroup._id"
          :refresh="dialog"
        />
      </v-card>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import {
  Permission,
  PermissionGroup,
  PermissionName,
  PermissionTabItem,
} from '~/types/types';
export default Vue.extend({
  props: {
    initPermGroup: {
      required: true,
      type: Object,
    } as PropOptions<PermissionGroup>,
    controlDialog: {
      required: true,
      type: Boolean,
    },
  },
  data() {
    return {
      dialog: false,
      tab: 0,
      tabItems: ['Ad', 'Device', 'Zone', 'Permission', 'Advanced'],
      permTabItems: [] as PermissionTabItem[],
      permGroup: this.initPermGroup,
      isAdmin: this.initPermGroup.name === 'admin',
    };
  },
  // watch: {
  //   controlDialog() {
  //     this.dialog = false;
  //   },
  // },
  watch: {
    dialog() {
      if (this.dialog) this.setMediaPermItems();
    },
  },
  methods: {
    addKeyToTabItem(key: PermissionName, tabItem: PermissionTabItem) {
      if (key in tabItem) {
        tabItem[key] = true;
      }
    },
    setMediaPermItems() {
      const adPermTabItem: PermissionTabItem = {
        ReadAd: false,
        WriteAd: false,
        DeleteAd: false,
      };
      const devicePermTabItem: PermissionTabItem = {
        ReadDevice: false,
        WriteDevice: false,
        DeleteDevice: false,
      };
      const zonePermTabItem: PermissionTabItem = {
        ReadZone: false,
        WriteZone: false,
        DeleteZone: false,
        ControlZone: false,
      };
      const permPermTabItem: PermissionTabItem = {
        ReadPermission: false,
        WritePermission: false,
        DeletePermission: false,
      };

      const advancedPermTabItem: PermissionTabItem = {
        ReadAnalytics: false,
      };
      this.permGroup.permissions.forEach((perm) => {
        const permName = Permission[perm] as PermissionName;
        this.addKeyToTabItem(permName, adPermTabItem);
        this.addKeyToTabItem(permName, devicePermTabItem);
        this.addKeyToTabItem(permName, zonePermTabItem);
        this.addKeyToTabItem(permName, permPermTabItem);
        this.addKeyToTabItem(permName, advancedPermTabItem);
      });
      this.$accessor.SET_PERMS(this.permGroup.permissions);
      this.permTabItems = [
        adPermTabItem,
        devicePermTabItem,
        zonePermTabItem,
        permPermTabItem,
        advancedPermTabItem,
      ];
    },
    async onUpdatePermGroup(updatedPermGroup: PermissionGroup) {
      await this.$handleErrors(async () => {
        this.permGroup = (
          await this.$axios.$put(
            this.$apiUrl.permGroup(this.permGroup._id),
            updatedPermGroup
          )
        ).permGroup;
        this.$toasted.success('Successfully updated permission group!');
      });
    },
  },
});
</script>
<style scoped>
.perm-tabs {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
