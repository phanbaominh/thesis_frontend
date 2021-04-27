<template>
  <v-list-item>
    <!-- <v-list-item-content> {{ permItem.name }}</v-list-item-content> -->
    <v-list-item-action>
      <v-switch v-model="isChecked" flat>
        <template #label>
          <v-list-item-content class="ml-2">
            {{ permItem.name }}
          </v-list-item-content>
        </template>
      </v-switch>
    </v-list-item-action>
  </v-list-item>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    permItem: {
      required: true,
      type: Object,
    } as Vue.PropOptions<{ name: string; enabled: boolean; value: number }>,
  },
  data() {
    return {
      isChecked: this.permItem.enabled,
    };
  },
});
</script>
