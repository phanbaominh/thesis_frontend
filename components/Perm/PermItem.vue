<template>
  <v-list-item>
    <!-- <v-list-item-content> {{ permItem.name }}</v-list-item-content> -->
    <v-list-item-action>
      <v-switch v-model="isChecked" flat>
        <template #label>
          <v-list-item-content class="ml-2">
            {{ name }}
          </v-list-item-content>
        </template>
      </v-switch>
    </v-list-item-action>
  </v-list-item>
</template>
<script lang="ts">
import Vue from 'vue';
import { Permission, PermissionName } from '~/types/types';
export default Vue.extend({
  props: {
    enabled: {
      type: Boolean,
      required: true,
    },
    name: {
      type: String,
      required: true,
    } as Vue.PropOptions<PermissionName>,
  },
  data() {
    return {
      isChecked: this.enabled,
    };
  },
  watch: {
    isChecked(value) {
      if (value) {
        this.$accessor.ADD_TO_PERMS(Permission[this.name]);
      } else {
        this.$accessor.REMOVE_PERM(Permission[this.name]);
      }
    },
  },
});
</script>
