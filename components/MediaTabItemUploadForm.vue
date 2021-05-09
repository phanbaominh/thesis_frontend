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
        v-bind.sync="adset.gender"
        :multiple="null"
      >
      </AdsetSelectMultiple>

      <BaseSubmitActions
        :is-disabled="!Boolean(duration && uploadedFile) && !isUpdateForm"
        @close="$emit('close')"
      >
        Confirm
        <template #close> Close </template>
      </BaseSubmitActions>
    </v-card>
  </v-form>
</template>
<script lang="ts">
import Vue from 'vue';
import { AdsetConst, Select } from '~/types/types';
export default Vue.extend({
  props: {
    media: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      uploadedFile: null as File | null,
      duration: 0,
      valid: false,
      uploadFileRules: [(v: any) => !!v || 'File is required'],
      adset: {
        ages: { value: [], strict: false },
        gender: { value: 0, strict: false },
        ...this.media.adset,
      },
      ages: AdsetConst.ranges.map((range, i) => ({
        value: i,
        text: range,
      })) as Select[],
      genders: [
        { text: 'Male', value: 10 },
        { text: 'Female', value: 11 },
      ] as Select[],
    };
  },
  computed: {
    isUpdateForm() {
      return !!this.media;
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
          this.$emit('submit');
          this.uploadedFile = null;
        } catch {
          // DO NOTHING
        }
      }
    },
    async onUpdate() {
      try {
        await this.$axios.$put(this.$apiUrl.video(this.media._id), this.adset);
        this.$emit('submit');
      } catch {}
    },
  },
});
</script>
