<template>
  <nuxt-child />
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  middleware: [
    'checkUserIsBuildingManager',
    ({ $permission, $auth, redirect }) => {
      if ($auth.user) {
        if (!$permission.check($permission.AdPermissions)) return redirect('/');
      }
    },
  ],
});
</script>
