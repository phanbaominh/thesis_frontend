<template>
  <v-row>
    <v-btn
      v-if="$permission.canGeneralWriteZone()"
      class="mr-2"
      color="primary"
      x-small
      fab
      depressed
      nuxt
      :to="`/zones/${zone._id}/edit`"
      @click.native.stop
    >
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <AdTableActionDialog
      v-if="canGeneralDeleteZone()"
      :disabled="hasAds"
      icon="delete"
      color="error"
      @confirm="$emit('delete', zone._id)"
    />
  </v-row>
</template>
<script lang="ts">
import Vue from 'vue';
import { Permission, Zone } from '~/types/types';
export default Vue.extend({
  props: {
    zone: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Zone>,
  },
  computed: {
    hasAds(): boolean {
      return this.zone.adArray.length > 0;
    },
  },
  methods: {
    canGeneralDeleteZone() {
      return this.$permission.check(Permission.DeleteZone, {
        isToasting: false,
      });
    },
  },
});
</script>
