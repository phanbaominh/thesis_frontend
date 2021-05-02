<template>
  <DataIterator :init-items="zonePermGroups" type="Zone">
    <PermUserDialogCreate
      :zone-perm-groups="zonePermGroups"
      :control-dialog="controlDialog"
      @submit="onCreateZonePermissionGroup"
    />
    <template #main="{ items: displayedItems }">
      <v-list>
        <v-list-item>
          <v-list-item-content
            class="text-subtitle-1 font-weight-bold text-sm-h6"
          >
            <v-row>
              <v-col cols="4">Zone</v-col>
              <v-divider vertical></v-divider>
              <v-col>Permission Groups</v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mx-2" />
        <template v-for="item in displayedItems">
          <v-list-item :key="item._id">
            <v-list-item-content class="text-body-1 font-weight-regular">
              <v-row>
                <v-col cols="4"> {{ item.zone.name }}</v-col>
                <v-divider vertical></v-divider>
                <v-col>
                  <div
                    v-for="permGroup in item.permissionGroups"
                    :key="permGroup._id"
                  >
                    {{ permGroup.name }}
                  </div>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
          <!--eslint-disable-next-line vue/valid-v-for-->
          <v-divider class="mx-2" />
        </template>
      </v-list>
    </template>
  </DataIterator>
</template>
<script lang="ts">
import Vue from 'vue';
import { Select, Subuser, ZonePermissionGroup } from '~/types/types';
export default Vue.extend({
  props: {
    zonePermGroups: {
      type: Array,
      required: true,
    } as Vue.PropOptions<ZonePermissionGroup[]>,
    user: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Subuser>,
  },
  data() {
    return {
      controlDialog: true,
    };
  },
  methods: {
    async onCreateZonePermissionGroup({
      zone,
      permGroups,
    }: {
      zone: Select;
      permGroups: Select[];
    }) {
      try {
        await this.$axios.post(this.$apiUrl.userPerms, {
          zone: zone.value,
          permissionGroup: permGroups.map((pg) => pg.value),
          user: this.user._id,
        });
        // const found = this.zonePermGroups.find(
        //   (zp) => zp.zone._id === zone.value
        // );

        // if (found) found.permissionGroups ;
        this.controlDialog = !this.controlDialog;
      } catch {}
    },
  },
});
</script>
