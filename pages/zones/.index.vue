<template>
  <BaseFetcher :fetch-state="$fetchState">
    <DataIterator type="Zones" :init-items="zones">
      <!-- <lazy-DialogName
        v-if="$permission.canGeneralWriteZone()"
        init-name=""
        title="Create a zone:"
        @updateName="onNewZone"
      >
      </lazy-DialogName> -->
      <v-btn
        depressed
        fab
        :color="'blue'"
        class="align-self-center mr-2"
        :small="!$vuetify.breakpoint.xs"
        :x-small="$vuetify.breakpoint.xs"
        dark
        nuxt
        to="/zones/create"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <template #main="{ items: displayedZones }">
        <v-row>
          <v-col
            v-for="zone in displayedZones"
            :key="zone._id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-card-title class="subheading font-weight-bold">
                <nuxt-link :to="`/zones/${zone._id}`">{{
                  zone.name
                }}</nuxt-link>
                <v-spacer></v-spacer>
                <v-btn
                  class="mr-2"
                  color="primary"
                  x-small
                  fab
                  depressed
                  nuxt
                  :to="`/zones/${zone._id}/edit`"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <DialogDelete
                  v-if="canGeneralDeleteZone()"
                  v-slot="{ on, attrs }"
                  @delete="onDeleteZone(zone)"
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
                </DialogDelete>
              </v-card-title>
              <v-divider></v-divider>
              <ZoneDesc :zone="zone" />
            </v-card>
          </v-col>
        </v-row>
      </template>
    </DataIterator>
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { Permission, Zone, ZonePermissionGroup } from '~/types/types';
export default Vue.extend({
  middleware: 'checkUserIsBuildingManager',
  data() {
    return {
      zones: [] as Zone[],
    };
  },
  async fetch() {
    this.zones = (await this.$axios.$get(this.$apiUrl.zones)).zones;
    if (this.$auth.user?.adminId) {
      const zoneIds = (this.$auth.user
        ?.zonePermissionGroups as ZonePermissionGroup[]).map(
        (zpg) => zpg.zone._id
      );
      this.zones = this.zones.filter(
        (zone) =>
          zoneIds.includes(zone._id) &&
          zone._id !== this.$auth.user?.generalZoneId
      );
    } else {
      this.zones = this.zones.filter(
        (zone) => zone._id !== this.$auth.user?.generalZoneId
      );
    }
  },
  methods: {
    async onNewZone(name: string) {
      await this.$handleErrors(async () => {
        const newZone = (await this.$axios.$post(this.$apiUrl.zones, { name }))
          .zone;
        this.zones.push(newZone);
        this.$toast.success('Succesfully created a zone!');
      });
    },
    async onDeleteZone(deletedZone: Zone) {
      await this.$handleErrors(async () => {
        await this.$axios.$delete(this.$apiUrl.zone(deletedZone._id));
        this.zones = this.zones.filter((zone) => deletedZone._id !== zone._id);
        this.$toast.success('Succesfully deleted zone!');
      });
    },

    canGeneralDeleteZone() {
      return this.$permission.check(Permission.DeleteZone, {
        isToasting: false,
      });
    },
  },
});
</script>
