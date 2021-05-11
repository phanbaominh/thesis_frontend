<template>
  <BaseDialogForm
    title="Create an ad:"
    :action="`${$apiUrl}/permissions`"
    :control-dialog="dialog"
    v-bind="$attrs"
    @submit="onSubmit"
  >
    <template #activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <BaseFetcher :fetch-state="$fetchState">
      <template #pending>Fetching adsets, media...</template>
      <v-text-field
        v-model="ad.name"
        name="name"
        label="Name"
        outlined
        dense
        :rules="[(v) => !!v || 'Name is required']"
      >
      </v-text-field>
      <v-select
        v-model="ad.adSetId"
        name="adset"
        label="Adset"
        outlined
        dense
        :items="adsets"
        hint="Pick an adset"
        persistent-hint
        :rules="[(v) => !!v || 'Adset is required']"
      >
      </v-select>
      <v-select
        v-model="ad.contentId"
        name="playlist"
        label="Playlist"
        outlined
        dense
        :items="mediaArray"
        hint="Pick a playlist"
        persistent-hint
        :rules="[(v) => !!v || 'Playlist is required']"
      >
      </v-select>
      <v-select
        v-model="ad.bdManagerId"
        name="buildingManager"
        label="Building Manager"
        outlined
        dense
        :items="buildingManagers"
        hint="Pick a building manager"
        persistent-hint
        :rules="[(v) => !!v || 'Building manager is required']"
      >
      </v-select>
      <v-text-field
        v-model="ad.budget"
        name="budget"
        label="Budget"
        outlined
        dense
        type="number"
        persistent-hint
        hint="Pick a budget"
        :rules="[
          (v) => !!v || 'Budget is required',
          (v) => (v && v >= 0) || 'Budget has to be larger than 0',
        ]"
      />
    </BaseFetcher>
  </BaseDialogForm>
</template>
<script lang="ts">
import Vue from 'vue';
import { Ad, Adset, Playlist, Select, TypeUser, User } from '~/types/types';

export default Vue.extend({
  props: {
    initAd: {
      default: null,
      type: Object,
    } as Vue.PropOptions<Adset | null>,
    dialog: {
      required: true,
      type: Boolean,
    },
  },
  data() {
    return {
      ad: {
        name: '',
        bdManagerId: '',
        adSetId: '',
        contentId: '',
        budget: 0,
      } as Omit<Ad, '_id'>,
      mediaArray: [] as Select[],
      adsets: [] as Select[],
      buildingManagers: [] as Select[],
    };
  },
  async fetch() {
    this.adsets = (
      await this.$axios.$get(this.$apiUrl.adsets)
    ).adsets.map((ad: Adset) => ({ text: ad.name, value: ad._id }));
    this.mediaArray = (
      await this.$axios.$get(this.$apiUrl.playlists)
    ).playlists.map((pl: Playlist) => ({ text: pl.name, value: pl._id }));
    this.buildingManagers = (
      await this.$axios.$get(this.$apiUrl.userTypeUser, {
        params: { typeUser: TypeUser.BuildingManager },
      })
    ).users.map((bm: User) => ({
      text: bm.username,
      value: bm._id,
    }));
  },
  methods: {
    onSubmit() {
      this.$emit('submit', this.ad);
    },
  },
});
</script>
