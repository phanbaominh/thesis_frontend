<template>
  <DataIterator :type="type" :init-items="mediaArray">
    <v-btn depressed class="align-self-center" color="blue" x-large>
      Upload {{ type }}
      <v-icon class="ml-2" large> mdi-cloud-upload </v-icon>
    </v-btn>
    <template #main="{ items: displayedMediaArray }">
      <MediaList :items="displayedMediaArray">
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
  </DataIterator>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
export default Vue.extend({
  props: {
    mediaArray: {
      required: true,
      type: Array,
    } as PropOptions<{ title: string }[]>,
    type: {
      required: true,
      type: String,
    },
  },
});
</script>
