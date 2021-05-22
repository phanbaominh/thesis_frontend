<template>
  <v-list-item two-line>
    <v-list-item-avatar>
      <v-img :alt="`${bdManager.username} avatar`" :src="bdManager.avatar">
      </v-img>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>
        {{ bdManager.username }}
      </v-list-item-title>
      <v-list-item-subtitle>
        {{ $truncate(bdManager.desc, 30) }}</v-list-item-subtitle
      >
    </v-list-item-content>
  </v-list-item>
</template>
<script lang="ts">
import Vue from 'vue';
import { User } from '~/types/types';
export default Vue.extend({
  props: {
    bdManager: {
      type: Object,
      required: true,
    } as Vue.PropOptions<User>,
  },
});
</script>
