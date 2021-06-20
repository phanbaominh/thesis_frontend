<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>
        <BaseBackButton @click="onBack"> </BaseBackButton>
        {{ initAd ? `Update ad ${initAd.name}` : 'Create an ad' }}
      </v-card-title>
      <BaseFetcher :fetch-state="$fetchState">
        <template #pending>Fetching adsets, media...</template>
        <v-form
          ref="form"
          v-model="valid"
          :action="$apiUrl.ads"
          method="post"
          @submit.prevent="onSubmit"
        >
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
            :rules="[(v) => !!v || 'Adset is required']"
          >
          </v-select>
          <AdFormAdsetInfo v-if="ad.adSetId" :adset-id="ad.adSetId" />
          <v-row>
            <v-col>
              <v-select
                v-model="ad.contentId"
                name="playlist"
                label="Playlist"
                outlined
                dense
                :items="mediaArray"
                :rules="[(v) => !!v || 'Playlist is required']"
              >
              </v-select>
            </v-col>
            <v-col v-if="ad.contentId">
              <AdFormPlaylistInfo :playlist-id="ad.contentId" class="mt-2"
            /></v-col>
          </v-row>
          <v-select
            v-model="ad.bdManagerId"
            name="buildingManager"
            label="Building Manager"
            outlined
            dense
            :items="buildingManagers"
            :rules="[(v) => !!v || 'Building manager is required']"
          >
            <template #item="{ on, attrs, item }">
              <v-list-item two-line v-bind="attrs" v-on="on">
                <v-list-item-avatar>
                  <v-img :alt="`${item.username} avatar`" :src="item.avatar">
                  </v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.username }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $truncate(item.desc, 30) }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </template>
            <template #selection="{ item }">
              <AdBdManagerListItem :bd-manager="item" />
            </template>
          </v-select>
          <AdFormBdManagerInfo
            v-if="ad.bdManagerId"
            :bd-manager-id="ad.bdManagerId"
            :zone-ids.sync="ad.zoneIds"
            class="mb-2"
          />
          <v-text-field
            v-model="ad.budget"
            name="budget"
            label="Budget"
            outlined
            dense
            type="number"
            :rules="[
              (v) => !!v || 'Budget is required',
              (v) => (v && v >= 0) || 'Budget has to be larger than 0',
            ]"
          />
          <BaseSubmitActions>
            {{ initAd ? 'Update' : 'Create' }}
          </BaseSubmitActions>
        </v-form>
      </BaseFetcher>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import Vue from 'vue';
import { Ad, Adset, Playlist, Select, TypeUser, User } from '~/types/types';

export default Vue.extend({
  props: {
    initAd: {
      default: null,
      type: Object,
    } as Vue.PropOptions<Ad | null>,
  },
  data() {
    return {
      ad: {
        name: '',
        bdManagerId: '',
        adSetId: '',
        contentId: '',
        budget: 0,
        zoneIds: [],
        ...this.initAd,
      } as Omit<Ad, '_id'>,
      valid: false,
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
      ...bm,
    }));
  },
  methods: {
    async onSubmit() {
      if (!(this.$refs.form as any).validate()) return;
      await this.$handleErrors(async () => {
        const newAd = this.initAd
          ? ((await this.$axios.$put(this.$apiUrl.ad(this.initAd._id), this.ad))
              .adOffer as Ad)
          : ((await this.$axios.$post(this.$apiUrl.ads, this.ad))
              .adOffer as Ad);
        this.$toast.success(
          `You have successfully ${this.initAd ? 'updated' : 'created an'} ad`
        );
        this.$router.push(`/ads/${newAd._id}`);
      });
    },
    onBack() {
      this.$router.push('/ads');
    },
  },
});
</script>
