<template>
  <v-card class="pa-4">
    <EditableName
      :init-name="playlist.name"
      @updateName="playlist.name = $event"
    />
    <v-card outlined class="mt-2">
      <PlaylistMain
        :media-array="playlist.mediaArray"
        @onConfirm="onConfirmDelete"
      >
        <v-dialog v-model="isAddDialog" width="1000" scrollable>
          <template #activator="{ on, attrs }">
            <BaseButtonToolbar icon="plus" v-bind="attrs" v-on="on" />
          </template>

          <v-card>
            <PlaylistMain
              is-add
              :media-array="allMediaArray"
              @onConfirm="onConfirmAdd"
              @onClose="closeDialog"
            />
          </v-card>
        </v-dialog>
      </PlaylistMain>
    </v-card>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
import { Media, Playlist } from 'types/types';
import BaseButtonToolbar from '~/components/BaseButtonToolbar.vue';
export default Vue.extend({
  components: { BaseButtonToolbar },
  async asyncData({ route }) {
    // const zone = (
    //   await $axios.$get($apiUrl.getzone(route.params.zone.slice(1)))
    // ).zone;
    await Promise.resolve();
    let testArray = new Array(10).fill(0);
    testArray = testArray.map((_n, i) => ({ name: `Media${i}` }));
    const playlist = {
      name: route.params.name,
      mediaArray: testArray,
    };
    return { playlist };
  },
  data() {
    return {
      playlist: (null as any) as Playlist,
      isAddDialog: false,
      allMediaArray: new Array(10)
        .fill(0)
        .map((_n, i) => ({ name: `New Media${i}` })),
    };
  },
  methods: {
    onConfirmDelete(deletedMediaArray: Media[]) {
      if (!this.playlist.mediaArray) return;
      const deletedNames = deletedMediaArray.map((media) => media.name);
      this.playlist.mediaArray = this.playlist.mediaArray.filter(
        (media) => !deletedNames.includes(media.name)
      );
    },
    onConfirmAdd(addedMediaArray: Media[]) {
      if (!this.playlist.mediaArray) this.playlist.mediaArray = [];
      addedMediaArray.forEach((media) => this.playlist.mediaArray!.push(media));
      this.closeDialog();
    },
    closeDialog() {
      this.isAddDialog = false;
    },
  },
});
</script>
