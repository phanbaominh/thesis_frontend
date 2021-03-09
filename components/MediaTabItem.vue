<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Fetching {{ type }}... </template>
    <DataIterator :type="type" :init-items="mediaArray" :compact="compact">
      <v-btn
        v-if="!compact"
        depressed
        class="align-self-center"
        color="blue"
        x-large
      >
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
          <template #actions="{ item: media }">
            <v-list-item-action>
              <v-btn fab depressed small color="primary"
                ><v-icon>mdi-play</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <DialogDelete
                v-slot="{ on, attrs }"
                @delete="$emit('delete', media)"
              >
                <v-btn
                  fab
                  depressed
                  small
                  color="error"
                  v-bind="attrs"
                  v-on="on"
                  ><v-icon>mdi-delete</v-icon>
                </v-btn>
              </DialogDelete>
            </v-list-item-action>
          </template>
        </MediaList>
      </template>
    </DataIterator>
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { Media } from '~/types/types';
export default Vue.extend({
  props: {
    type: {
      required: true,
      type: String,
    },
    compact: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      mediaArray: (null as any) as Media[],
    };
  },
  async fetch() {
    await Promise.resolve();
    const testArray = new Array(10).fill(0);
    this.mediaArray = testArray.map((_n, i) => ({ name: `Video${i}` }));
  },
  methods: {
    onDelete(media: Media) {
      this.mediaArray = this.mediaArray.filter((m) => m.name !== media.name);
    },
  },
});
</script>
