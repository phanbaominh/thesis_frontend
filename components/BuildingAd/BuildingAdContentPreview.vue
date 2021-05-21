<template>
  <v-dialog
    v-model="dialog"
    width="1000"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :hide-overlay="$vuetify.breakpoint.mdAndDown"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        class="ml-2"
        fab
        dark
        depressed
        color="blue"
        v-bind="attrs"
        x-small
        v-on="on"
      >
        <v-icon>mdi-eye</v-icon>
      </v-btn>
    </template>
    <v-card class="px-2">
      <BaseFetcher :fetch-state="$fetchState">
        <template #pending> Fetching videos... </template>

        <DataIterator type="Videos" :init-items="playlistMediaArray">
          <BaseButtonToolbar color="grey" icon="close" @click="dialog = false">
          </BaseButtonToolbar>

          <template #main="{ items: displayedItems }">
            <v-row class="mt-2">
              <v-col
                v-for="media in displayedItems"
                :key="media._id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card outlined>
                  <v-card-title
                    class="subheading font-weight-bold"
                    :title="media.name"
                    >{{ $truncate(media.name, 10) }}
                    <v-spacer></v-spacer>
                    <MediaTabItemPlayDialog :media="media" />
                  </v-card-title>
                  <v-spacer></v-spacer>
                  <v-divider></v-divider>
                  <v-card-text>
                    <AdsetDesc :ad-set="media.adSetId" />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </DataIterator>
      </BaseFetcher>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue from 'vue';
import { DetailedAd, Media } from '~/types/types';
export default Vue.extend({
  props: {
    ad: {
      type: Object,
      required: true,
    } as Vue.PropOptions<DetailedAd>,
  },
  data() {
    return {
      dialog: false,
      playlistMediaArray: [] as Media[],
    };
  },
  async fetch() {
    this.playlistMediaArray = (
      await this.$axios.$get(this.$apiUrl.adMediaPreview(this.ad._id), {
        params: { videoIds: this.ad.contentId.mediaArray },
      })
    ).videos;
  },
});
</script>
