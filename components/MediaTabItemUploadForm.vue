<template>
  <v-form
    ref="form"
    v-model="valid"
    action=""
    @submit.prevent="onConfirmUpload"
  >
    <v-card class="pa-4">
      <BaseDialogTitle @close="$emit('close')"> File Upload </BaseDialogTitle>
      <v-file-input
        v-if="!isUpdateForm"
        v-model="uploadedFile"
        label="Choose file to upload"
        accept="video/*"
        name="file"
        :rules="uploadFileRules"
      >
      </v-file-input>
      <v-select
        v-model="selectedAdset"
        name="preset"
        label="Preset"
        :items="mediaArray"
        :menu-props="{ maxHeight: '400' }"
        hint="Copy setting from other video"
        persistent-hint
        outlined
        dense
      >
      </v-select>
      <AdsetSelectMultiple
        name="age"
        label="Age ranges"
        :items="ages"
        :menu-props="{ maxHeight: '400' }"
        hint="Limited video to these age ranges"
        :rules="[(v) => v.length > 0 || 'Age range is required']"
        v-bind.sync="adset.ages"
      >
      </AdsetSelectMultiple>
      <AdsetSelectMultiple
        name="gender"
        label="Gender"
        :items="genders"
        :menu-props="{ maxHeight: '400' }"
        hint="Limited video to these genders"
        :rules="[(v) => v.length > 0 || 'Gender is required']"
        v-bind.sync="adset.genders"
        :multiple="null"
      >
      </AdsetSelectMultiple>

      <BaseSubmitActions
        :is-disabled="isSubmitDisabled"
        @close="$emit('close')"
      >
        <span v-if="!isUploading">Confirm</span>
        <span v-else>Uploading ... <LoadingSpinner /></span>
        <template #close> Close </template>
      </BaseSubmitActions>
    </v-card>
  </v-form>
</template>
<script lang="ts">
import Vue from 'vue';
import { AdsetConst, Select, Media } from '~/types/types';
export default Vue.extend({
  props: {
    media: {
      default: null,
      type: Object,
    } as Vue.PropOptions<Media | null>,
  },
  data() {
    return {
      uploadedFile: null as File | null,
      isUploading: false,
      duration: 0,
      valid: false,
      uploadFileRules: [(v: any) => !!v || 'File is required'],
      adset: {
        ages: { value: [], strict: false, ...this.media?.adSetId.ages },
        genders: { value: 0, strict: false, ...this.media?.adSetId.genders },
      },
      ages: AdsetConst.ages.map((range, i) => ({
        value: i,
        text: range,
      })) as Select[],
      genders: [
        { text: 'Male', value: 10 },
        { text: 'Female', value: 11 },
      ] as Select[],
      selectedAdset: null as {
        ages: { value: number[]; strict: boolean };
        genders: { value: number[]; strict: boolean };
      } | null,
    };
  },
  computed: {
    isUpdateForm() {
      return !!this.media;
    },
    isSubmitDisabled(): boolean {
      return (
        (!(this.duration && this.uploadedFile) && !this.isUpdateForm) ||
        this.isUploading
      );
    },
    mediaArray(): Select[] {
      return this.$accessor.allMediaArray
        .filter((media) => media._id !== this.media?._id)
        .map((m) => ({ text: m.name, value: m.adSetId }));
    },
  },
  watch: {
    selectedAdset() {
      if (this.selectedAdset) {
        this.adset.ages = { ...this.selectedAdset.ages };
        this.adset.genders = { ...this.selectedAdset.genders };
      }
    },
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
    async onConfirmUpload(e: Event) {
      e.preventDefault();
      if ((this.$refs.form as any).validate()) {
        if (this.isUpdateForm) {
          await this.onUpdate();
          return;
        }
        const bodyFormData = new FormData();
        bodyFormData.append('video', this.uploadedFile!);
        bodyFormData.append('duration', this.duration.toString());

        bodyFormData.append('adset', JSON.stringify(this.adset));
        console.log(bodyFormData.getAll('duration'));
        await this.$handleErrors(
          async () => {
            this.isUploading = true;
            const newVideo = (
              await this.$axios({
                method: 'post',
                url: `${this.$apiUrl.videos}`,
                data: bodyFormData,
                headers: { 'Content-Type': 'multipart/form-data' },
              })
            ).data;
            this.$accessor.ADD_MEDIA_TO_ARRAY(newVideo);
            this.$emit('submit');
            this.uploadedFile = null;
            this.refresh();
          },
          (_err) => (this.isUploading = false)
        );
      }
    },
    async onUpdate() {
      await this.$handleErrors(async () => {
        if (!this.media) return;
        await this.$axios.$put(this.$apiUrl.video(this.media._id), this.adset);
        this.$emit('submit');
        this.$toast.success('Successfully updated video settings');
      });
    },
    refresh() {
      this.adset = {
        ages: { value: [], strict: false },
        genders: { value: 0, strict: false },
      };
      this.isUploading = false;
    },
  },
});
</script>
