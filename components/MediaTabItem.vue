<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Fetching {{ type }}... </template>
    <!-- <DataIterator :type="type" :init-items="mediaArray">
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
        <v-form v-model="valid">
          <v-card class="pa-4">
            <v-file-input
              v-model="uploadedFile"
              label="Choose file to upload"
              accept="video/*"
              name="file"
              :rules="[Boolean(duration && uploadedFile)]"
            >
            </v-file-input>
            <BaseDialogActions
              @close="isUploadDialog = false"
              @confirm="onConfirmUpload"
            >
              Confirm
              <template #close> Close </template>
            </BaseDialogActions>
          </v-card>
        </v-form>
      </v-dialog>

      <template #main="{ items: displayedMediaArray }">
        <MediaList :items="displayedMediaArray">
          <template #actions="{ item: media }">
            <v-list-item-action>
              <MediaTabItemPlayDialog :media="media" />
            </v-list-item-action>
            <v-list-item-action>
              <DialogDelete color="error" @delete="onDelete(media)">
                <v-icon>mdi-delete</v-icon>
              </DialogDelete>
            </v-list-item-action>
          </template>
        </MediaList>
      </template>
    </DataIterator> -->
    <MediaSelector
      :media-array="mediaArray"
      :type="'Videos'"
      :compact="false"
      @confirm="onConfirmDelete"
    >
      <template #actions="{ media }">
        <v-list-item-action>
          <MediaTabItemPlayDialog :media="media" />
        </v-list-item-action>
      </template>
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
        <v-form v-model="valid">
          <v-card class="pa-4">
            <v-file-input
              v-model="uploadedFile"
              label="Choose file to upload"
              accept="video/*"
              name="file"
              :rules="[Boolean(duration && uploadedFile)]"
            >
            </v-file-input>
            <BaseDialogActions
              @close="isUploadDialog = false"
              @confirm="onConfirmUpload"
            >
              Confirm
              <template #close> Close </template>
            </BaseDialogActions>
          </v-card>
        </v-form>
      </v-dialog>
    </MediaSelector>
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
      // mediaArray: (null as any) as Media[],
      isUploadDialog: false,
      uploadedFile: null as File | null,
      duration: 0,
      valid: false,
      tags: [],
    };
  },
  async fetch() {
    await this.$accessor.setAllMediaArray();
  },
  computed: {
    mediaArray() {
      return this.$accessor.allMediaArray;
    },
  },
  watch: {
    uploadedFile(newVal) {
      if (newVal) {
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = () => {
          (window.URL || window.webkitURL).revokeObjectURL(video.src);
          this.duration = video.duration;
          video.remove();
        };

        video.src = URL.createObjectURL(newVal);
      }
    },
  },
  methods: {
    async onDelete(media: Media) {
      try {
        await this.$axios.$delete(this.$apiUrl.video(media._id));
        this.mediaArray = this.mediaArray.filter((m) => m._id !== media._id);
      } catch {
        // DO NOTHING
      }
    },
    async onConfirmDelete(deletedArray: Media[]) {
      const deletedIds = deletedArray.map((media) => media._id);
      try {
        for (const id of deletedIds) {
          await this.$axios.$delete(this.$apiUrl.video(id));
        }
        this.$accessor.DELETE_MEDIA_FROM_ARRAY(deletedIds);
      } catch {
        // DO NOTHING
      }
    },
    async onConfirmUpload() {
      if (this.uploadedFile) {
        const bodyFormData = new FormData();
        bodyFormData.append('video', this.uploadedFile!);
        bodyFormData.append('duration', this.duration.toString());
        bodyFormData.append('tags', this.tags.toString());

        try {
          const newVideo = (
            await this.$axios({
              method: 'post',
              url: `${this.$apiUrl.videos}`,
              data: bodyFormData,
              headers: { 'Content-Type': 'multipart/form-data' },
            })
          ).data;
          this.$accessor.ADD_MEDIA_TO_ARRAY(newVideo);
          this.isUploadDialog = false;
        } catch {
          // DO NOTHING
        }
      } else {
        this.isUploadDialog = false;
      }
    },
    // removeFile(index: number) {
    //   this.uploadedFiles = this.uploadedFiles.filter((_, i) => i !== index);
    // },
  },
});
</script>
