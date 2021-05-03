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
                <v-col cols="5">Permission Groups</v-col>
                <v-divider vertical></v-divider>
                <v-col>Actions</v-col>
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
                  <v-col cols="5">
                    <div
                      v-for="permGroup in item.permissionGroups"
                      :key="permGroup._id"
                    >
                      {{ permGroup.name }}
                    </div>
                  </v-col>
                  <v-divider vertical></v-divider>
                  <v-col>
                    <PermUserDialogUpdate
                      :zone-perm-groups="zonePermGroups"
                      :init-zone="item.zone"
                      :control-dialog="controlDialog"
                      @submit="onUpdateZonePermissions"
                    />
                    <DialogDelete
                      color="error"
                      @delete="onDeleteZone(item.zone)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </DialogDelete>
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
  PermissionGroup,
  PermissionRelation,
  Select,
  Subuser,
  Zone,
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
  computed: {
    allPermGroups(): PermissionGroup[] {
      return this.$accessor.allPermGroups;
    },
  },
  watch: {
    allPermGroups() {
      this.$fetch();
    },
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
          const newPG = {
            _id: permGroups[i].value,
            name: permGroups[i].text,
            relationId: relation._id,
          };
          const foundIndex = this.findIndexOfZone(zone.value);
          if (foundIndex >= 0) {
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
      } catch (err) {
        console.log(err);
      }
    },
    async onUpdateZonePermissions({
      zone,
      newPermGroups,
      deletedPermGroups,
    }: {
      zone: Select;
      newPermGroups: Select[];
      deletedPermGroups: Select[];
    }) {
      try {
        if (deletedPermGroups.length > 0) {
          await this.$axios.$post(this.$apiUrl.userPermDeleteMany, {
            user: this.user._id,
            zone: zone.value,
            permissionGroups: deletedPermGroups.map((pg) => pg.value),
          });
          const foundIndex = this.findIndexOfZone(zone.value);
          if (foundIndex >= 0) {
            const newZonePermGroups = this.zonePermGroups[foundIndex];
            newZonePermGroups.permissionGroups = newZonePermGroups.permissionGroups.filter(
              (pg) => !deletedPermGroups.find((d) => d.value === pg._id)
            );
            if (newZonePermGroups.permissionGroups.length === 0)
              this.$delete(this.zonePermGroups, foundIndex);
            else this.$set(this.zonePermGroups, foundIndex, newZonePermGroups);
          }
        }
        if (newPermGroups.length > 0) {
          await this.onCreateZonePermissionGroup({
            zone,
            permGroups: newPermGroups,
          });
        } else {
          this.controlDialog = !this.controlDialog;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async onDeleteZone(deletedZone: Zone) {
      try {
        await this.$axios.$post(this.$apiUrl.userPermDeleteZone, {
          zone: deletedZone._id,
          user: this.user._id,
        });
        const foundIndex = this.findIndexOfZone(deletedZone._id);
        if (foundIndex >= 0) this.$delete(this.zonePermGroups, foundIndex);
      } catch {}
    },
    findIndexOfZone(zoneId: string) {
      const foundIndex = this.zonePermGroups.findIndex((zpg) => {
        return zpg.zone._id === zoneId;
      });
      return foundIndex;
    },
  },
});
</script>
