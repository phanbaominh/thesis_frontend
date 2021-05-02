<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending>Fetching permissions...</template>
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
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import {
  PermissionRelation,
  Select,
  Subuser,
  ZonePermissionGroup,
} from '~/types/types';
export default Vue.extend({
  props: {
    user: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Subuser>,
  },
  data() {
    return {
      controlDialog: true,
      zonePermGroups: [] as ZonePermissionGroup[],
    };
  },
  async fetch() {
    this.zonePermGroups = (
      await this.$axios.$get(this.$apiUrl.userPermSubuser(this.user._id))
    ).userPermissions;
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
        const newPermissionRelations = (
          await this.$axios.$post(this.$apiUrl.userPermInsertMany, {
            zone: zone.value,
            permissionGroups: permGroups.map((pg) => pg.value),
            user: this.user._id,
          })
        ).userPermissions as PermissionRelation[];
        newPermissionRelations.forEach((relation, i) => {
          const foundIndex = this.zonePermGroups.findIndex(
            (zpg) => zpg.zone._id === zone.value
          );

          const newPG = {
            _id: permGroups[i].value,
            name: permGroups[i].text,
            relationId: relation._id,
          };
          if (foundIndex) {
            const newZonePermGroup = this.zonePermGroups[foundIndex];
            newZonePermGroup.permissionGroups.push(newPG);
            this.$set(this.zonePermGroups, foundIndex, newZonePermGroup);
          } else {
            this.zonePermGroups.push({
              zone: { _id: zone.value, name: zone.text },
              permissionGroups: [newPG],
            });
          }
        });

        // if (found) found.permissionGroups ;
        this.controlDialog = !this.controlDialog;
      } catch {}
    },
  },
});
</script>
