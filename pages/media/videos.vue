<template>
  <BaseFetcher :fetch-state="$fetchState">
    <template #pending> Fetching videos... </template>
    <MediaSelector
      :media-array="mediaArray"
      :type="'Videos'"
      :compact="false"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      :hide-overlay="$vuetify.breakpoint.smAndDown"
      :delete-perm="$permission.canGeneralDeleteAd()"
      @confirm="onConfirmDelete"
    >
      <template #actions="{ media }">
        <v-list-item-action>
          <MediaTabItemUpdateDialog :media="media" />
        </v-list-item-action>
        <v-list-item-action>
          <MediaTabItemPlayDialog :media="media" />
        </v-list-item-action>
      </template>
      <v-dialog
        v-if="$permission.canGeneralWriteAd()"
        v-model="isUploadDialog"
        width="500"
        scrollable
      >
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
        <MediaTabItemUploadForm
          @submit="isUploadDialog = false"
          @close="isUploadDialog = false"
        />
      </v-dialog>
    </MediaSelector>
  </BaseFetcher>
</template>
<script lang="ts">
import Vue from 'vue';
import { Media } from '~/types/types';
export default Vue.extend({
  data() {
    return {
      isUploadDialog: false,
      isUpdateDialog: false,
      mediaAdset: {
        ages: { value: [1, 2, 3], strict: true },
        gender: { value: 10, strict: true },
      },
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
  methods: {
    async onDelete(media: Media) {
      await this.$handleErrors(async () => {
        await this.$axios.$delete(this.$apiUrl.video(media._id));
        this.mediaArray = this.mediaArray.filter((m) => m._id !== media._id);
      });
    },
    async onConfirmDelete(deletedArray: Media[]) {
      const deletedIds = deletedArray.map((media) => media._id);
      await this.$handleErrors(async () => {
        for (const id of deletedIds) {
          try {
            await this.$axios.$delete(this.$apiUrl.video(id));
            this.$accessor.DELETE_MEDIA_FROM_ARRAY(id);
          } catch {}
        }
      });
    },
    // removeFile(index: number) {
    //   this.uploadedFiles = this.uploadedFiles.filter((_, i) => i !== index);
    // },
  },
});
</script>
