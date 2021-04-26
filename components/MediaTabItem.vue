<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Fetching {{ type }}... </template>
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
        <v-form v-model="valid" action="" @submit.prevent="onConfirmUpload">
          <v-card class="pa-4">
            <v-file-input
              v-model="uploadedFile"
              label="Choose file to upload"
              accept="video/*"
              name="file"
              :rules="uploadFileRules"
            >
            </v-file-input>
            <input style="display: none" />
            <BaseSubmitActions
              :is-disabled="!Boolean(duration && uploadedFile)"
              @close="isUploadDialog = false"
            >
              Confirm
              <template #close> Close </template>
            </BaseSubmitActions>
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
      uploadFileRules: [(v: any) => !!v || 'File is required'],
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
    async onConfirmUpload(e: Event) {
      e.preventDefault();
      if (this.uploadedFile && this.valid) {
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
