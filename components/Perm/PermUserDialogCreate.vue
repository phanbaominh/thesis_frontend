<template>
  <BaseDialogForm
    title="Add permission:"
    :action="`${$apiUrl}/permissions`"
    :control-dialog="controlDialog"
    :icon="icon"
    :max-width="400"
    @submit="onAddZonePermissions"
    @close="resetSelection"
  >
    <template #activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <BaseFetcher :fetch-state="$fetchState">
      <template #pending>Fetching zones, permission groups...</template>
      <v-select
        v-model="selectedZone"
        name="zone"
        label="Zone"
        outlined
        dense
        :items="zones"
        hint="Pick zone to grant permisions"
        return-object
        persistent-hint
        :rules="[(v) => !!v || 'Zone is required']"
      >
      </v-select>
      <v-select
        v-model="selectedPermGroups"
        name="permissions"
        label="Permissions"
        outlined
        dense
        :items="permGroups"
        :disabled="!selectedZone"
        :menu-props="{ maxHeight: '400' }"
        multiple
        hint="Pick permissions to grant user"
        return-object
        persistent-hint
        :rules="[(v) => v.length > 0 || 'Permission is required']"
      >
      </v-select>
    </BaseFetcher>
  </BaseDialogForm>
</template>
<script lang="ts">
import Vue from 'vue';
import {
  PermissionGroup,
  Select,
  Zone,
  ZonePermissionGroup,
} from '~/types/types';

export default Vue.extend({
  props: {
    icon: {
      default: 'plus',
      type: String,
    },
    zonePermGroups: {
      required: true,
      type: Array,
    } as Vue.PropOptions<ZonePermissionGroup[]>,
    controlDialog: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      selectedPermGroups: [] as Select[],
      selectedZone: null as Select | null,
      permGroups: [] as Select[],
      zones: [] as Select[],
    };
  },
  async fetch() {
    this.zones = (
      await this.$axios.$get(this.$apiUrl.zones)
    ).zones.map((z: Zone) => ({ text: z.name, value: z._id }));
    if (this.$auth.user?.generalZoneId)
      this.zones.push({
        text: 'General',
        value: this.$auth.user.generalZoneId as string,
      });
  },
  computed: {
    allPermGroups(): Select[] {
      return this.$accessor.allPermGroups
        .map((pg: PermissionGroup) => ({
          text: pg.name,
          value: pg._id,
        }))
        .filter((pg) => pg.text !== 'admin');
    },
  },
  watch: {
    selectedZone() {
      this.getNewPermissionGroups();
    },
    controlDialog() {
      this.resetSelection();
    },
  },
  methods: {
    resetSelection() {
      this.selectedPermGroups = [];
      this.selectedZone = null;
    },
    getNewPermissionGroups() {
      this.permGroups = this.allPermGroups;
      if (this.selectedZone) {
        const zonePermGroups = this.zonePermGroups.find(
          (zp) => zp.zone._id === this.selectedZone?.value
        );
        if (zonePermGroups) {
          const selectedPermGroupIds = zonePermGroups.permissionGroups.map(
            (pg) => pg._id
          );
          this.permGroups = this.allPermGroups.filter(
            (pg) => !selectedPermGroupIds.includes(pg.value)
          );
        } else {
          this.selectedPermGroups = [];
        }
      }
    },
    onAddZonePermissions() {
      this.$emit('submit', {
        zone: this.selectedZone,
        permGroups: this.selectedPermGroups,
      });
      // this.dialog = !this.dialog;
    },
  },
});
</script>
