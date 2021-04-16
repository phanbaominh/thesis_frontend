<template>
  <v-dialog v-model="dialog" width="1000">
    <template #activator="{ on, attrs }">
      <a
        href="#"
        class="text-truncate text-decoration-underline"
        v-bind="attrs"
        v-on="on"
      >
        {{ playlist.name }}
      </a>
    </template>
    <v-card class="pa-4">
      <EditableName
        :init-name="playlist.name"
        @updateName="updatePlaylistWithNewName"
      />
      <v-card outlined class="mt-2">
        <BaseFetcher :fetch-state="$fetchState">
          <MediaAddDelete
            :media-array="playlistMediaArray"
            :all-media-array="nonPlaylistMediaArray"
            type="Media"
            @add="onConfirmAdd"
            @delete="onConfirmDelete"
          />
        </BaseFetcher>
      </v-card>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { Media, Playlist } from 'types/types';
export default Vue.extend({
  props: {
    initPlaylist: {
      type: Object,
      required: true,
    } as PropOptions<Playlist>,
  },
  data() {
    return {
      dialog: false,
      playlist: this.initPlaylist,
      playlistMediaArray: [] as Media[],
      nonPlaylistMediaArray: [] as Media[],
    };
  },
  async fetch() {
    this.playlistMediaArray = (
      await this.$axios.$get(this.$apiUrl.videoArray, {
        params: { videoIds: this.playlist.mediaArray },
      })
    ).video;
    this.updateNonPlaylistMediaArray();
  },
  computed: {
    allMediaArray() {
      return this.$accessor.allMediaArray;
    },
  },
  watch: {
    allMediaArray() {
      this.updateNonPlaylistMediaArray();
    },
  },
  methods: {
    async onConfirmDelete(deletedMediaArray: Media[]) {
      if (!this.playlist.mediaArray) return;
      const deletedIds = deletedMediaArray.map((media) => media._id);
      const newMediaArray = this.playlist.mediaArray.filter(
        (id) => !deletedIds.includes(id)
      );
      await this.updatePlaylistWithNewMediaArray(newMediaArray);
      this.playlistMediaArray = this.playlistMediaArray.filter(
        (media) => !deletedIds.includes(media._id)
      );
    },
    async onConfirmAdd(addedMediaArray: Media[]) {
      if (!this.playlist.mediaArray) this.playlist.mediaArray = [];
      const newMediaArray = this.playlist.mediaArray.concat(
        addedMediaArray.map((media) => media._id)
      );
      await this.updatePlaylistWithNewMediaArray(newMediaArray);

      addedMediaArray.forEach((media) => this.playlistMediaArray.push(media));
    },
    async updatePlaylistWithNewMediaArray(newMediaArray: string[]) {
      await this.$axios.$put(this.$apiUrl.playlist(this.playlist._id), {
        ...this.playlist,
        mediaArray: newMediaArray,
      });
      this.playlist.mediaArray = newMediaArray;
      this.$emit('update:playlist', this.playlist);
      this.updateNonPlaylistMediaArray();
    },
    async updatePlaylistWithNewName(newName: string) {
      await this.$axios.$put(this.$apiUrl.playlist(this.playlist._id), {
        ...this.playlist,
        name: newName,
      });
      this.playlist.name = newName;
      this.$emit('update:playlist', this.playlist);
    },
    updateNonPlaylistMediaArray() {
      this.nonPlaylistMediaArray = this.allMediaArray.filter(
        (media) => !this.playlist.mediaArray.includes(media._id)
      );
    },
  },
});
</script>
