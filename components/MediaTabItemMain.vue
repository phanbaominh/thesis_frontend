<template>
  <MediaList :items="items">
    <template #default="{ item: media }">
      <v-list-item-content class="text-h6 font-weight-regular">
        {{ media.name }}
      </v-list-item-content>
    </template>
    <template #actions>
      <v-list-item-action>
        <v-btn fab depressed small color="primary"
          ><v-icon>mdi-play</v-icon>
        </v-btn>
      </v-list-item-action>
      <v-list-item-action>
        <v-btn fab depressed small color="error"
          ><v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-list-item-action>
    </template>
  </MediaList>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
export default Vue.extend({
  props: {
    items: {
      required: true,
      type: Array,
    } as PropOptions<{ name: string }[]>,
  },
});
</script>
