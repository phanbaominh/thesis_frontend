<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Fetching {{ type }}... </template>
    <DataIterator :type="type" :init-items="mediaArray">
      <v-dialog v-model="isUploadDialog" width="500" scrollable>
        <template #activator="{ on, attrs }">
          <v-btn
            depressed
            fab
            color="blue"
            class="align-self-center mr-2"
            v-bind="attrs"
            :small="!$vuetify.breakpoint.xs"
            :x-small="$vuetify.breakpoint.xs"
            v-on="on"
          >
            <v-icon>mdi-cloud-upload</v-icon>
          </v-btn>
        </template>
        <v-card class="pa-4">
          <v-file-input
            v-model="uploadedFiles"
            multiple
            label="Choose files to upload"
          >
            <template #selection="{ index, text }">
              <v-chip
                color="primary"
                dark
                label
                small
                close
                @click:close="removeFile(index)"
              >
                {{ text }}
              </v-chip>
            </template>
          </v-file-input>

          <BaseDialogActions
            @close="isUploadDialog = false"
            @confirm="onConfirmUpload"
          >
            Confirm
            <template #close> Close </template>
          </BaseDialogActions>
        </v-card>
      </v-dialog>

      <template #main="{ items: displayedMediaArray }">
        <MediaList :items="displayedMediaArray">
          <template #actions="{ item: media }">
            <v-list-item-action>
              <BaseButton color="primary"
                ><v-icon>mdi-play</v-icon>
              </BaseButton>
            </v-list-item-action>
            <v-list-item-action>
              <DialogDelete color="error" @delete="onDelete(media)">
                <v-icon>mdi-delete</v-icon>
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
  },
  data() {
    return {
      mediaArray: (null as any) as Media[],
      isUploadDialog: false,
      uploadedFiles: [],
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
    onConfirmUpload() {
      this.isUploadDialog = false;
    },
    removeFile(index: number) {
      this.uploadedFiles = this.uploadedFiles.filter((_, i) => i !== index);
    },
  },
});
</script>
