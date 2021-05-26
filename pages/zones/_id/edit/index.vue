<template>
  <ZoneCreateForm :init-zone="zone" />
</template>
<script lang="ts">
import Vue from 'vue';
import { Zone, ZonePermissionGroup } from 'types/types';
export default Vue.extend({
  middleware({ route, $auth, redirect, $toast, $permission }) {
    const hasPermissionOfZone = !!(
      $auth.user &&
      ($auth.user.zonePermissionGroups as ZonePermissionGroup[]).find(
        (zpg) => zpg.zone._id === route.params.id
      )
    );
    if (!(hasPermissionOfZone || $permission.canGeneralWriteZone())) {
      $toast.error("You don't have permission");
      redirect('/');
    }
  },
  async asyncData({ route, $axios, $apiUrl }) {
    const zone = (await $axios.$get($apiUrl.zone(route.params.id))).zone;
    return { zone };
  },
  data() {
    return {
      zone: (null as any) as Zone,
    };
  },
});
</script>
