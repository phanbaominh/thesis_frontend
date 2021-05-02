<template>
  <BaseDialogForm
    title="Update permission:"
    :action="`${$apiUrl}/permissions`"
    :control-dialog="controlDialog"
    icon="pencil"
    :max-width="400"
    @submit="onUpdateZonePermissions"
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
        disabled
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
        :items="allPermGroups"
        :menu-props="{ maxHeight: '400' }"
        multiple
        hint="Pick permissions to grant user"
        return-object
        persistent-hint
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
    zonePermGroups: {
      required: true,
      type: Array,
    } as Vue.PropOptions<ZonePermissionGroup[]>,
    initZone: {
      required: true,
      type: Object,
    } as Vue.PropOptions<Zone>,
    controlDialog: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      selectedPermGroups: [] as Select[],
      newPermGroups: [] as Select[],
      deletedPermGroups: [] as Select[],
      originalPermGroups: [] as Select[],
      selectedZone: null as Select | null,
      zones: [] as Select[],
    };
  },
  async fetch() {
    this.zones = (
      await this.$axios.$get(this.$apiUrl.zones)
    ).zones.map((z: Zone) => ({ text: z.name, value: z._id }));
  },
  computed: {
    allPermGroups(): Select[] {
      return this.$accessor.allPermGroups.map((pg: PermissionGroup) => ({
        text: pg.name,
        value: pg._id,
      }));
    },
  },
  watch: {
    controlDialog() {
      this.resetSelection();
    },
    selectedPermGroups(newVal: Select[]) {
      this.newPermGroups = newVal.filter(
        (pg) => !this.originalPermGroups.find((ogpg) => pg.value === ogpg.value)
      );
      this.deletedPermGroups = this.originalPermGroups.filter(
        (ogpg) => !newVal.find((pg) => pg.value === ogpg.value)
      );
    },
  },
  created() {
    if (this.initZone) {
      this.selectedZone = {
        text: this.initZone.name,
        value: this.initZone._id,
      };
      this.getNewPermissionGroups();
    }
  },
  methods: {
    resetSelection() {
      this.getNewPermissionGroups(true);
      this.newPermGroups = [];
      this.deletedPermGroups = [];
    },
    getNewPermissionGroups(reset = false) {
      if (this.selectedZone) {
        const zonePermGroups = this.zonePermGroups.find(
          (zp) => zp.zone._id === this.selectedZone?.value
        );
        if (zonePermGroups) {
          const selectedPermGroups = zonePermGroups.permissionGroups.map(
            (pg) => ({ text: pg.name, value: pg._id })
          );
          if (this.originalPermGroups.length === 0 || reset)
            this.originalPermGroups = selectedPermGroups;
          this.selectedPermGroups = selectedPermGroups;
        } else {
          this.selectedPermGroups = [];
        }
      }
    },
    onUpdateZonePermissions() {
      this.$emit('submit', {
        zone: this.selectedZone,
        newPermGroups: this.newPermGroups,
        deletedPermGroups: this.deletedPermGroups,
      });
      // this.dialog = !this.dialog;
    },
  },
});
</script>
