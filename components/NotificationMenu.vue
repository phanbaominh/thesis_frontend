<template>
  <div class="text-center">
    <v-menu v-model="menu" offset-y>
      <template #activator="{ on, attrs }">
        <v-badge
          :content="notReadCount"
          :value="notReadCount"
          color="green"
          overlap
        >
          <v-btn
            fab
            small
            depressed
            color="grey lighten-2"
            v-bind="attrs"
            :disabled="notifications.length === 0 ? true : false"
            v-on="on"
            @click="onMenu"
          >
            <v-icon :color="menu ? 'primary' : 'black'"> mdi-bell </v-icon>
          </v-btn>
        </v-badge>
      </template>
      <v-list class="noti-list">
        <div v-for="(noti, i) in notifications" :key="noti._id">
          <v-card class="pa-2" flat nuxt :to="noti.link" :tabindex="i + 2">
            <div class="text-subtitle-1">{{ noti.text }}</div>
            <span class="text-caption">{{ getDateSubtitle(noti.cTime) }}</span>
          </v-card>
          <v-divider></v-divider>
        </div>
      </v-list>
    </v-menu>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AppNotification } from '~/types/types';
dayjs.extend(relativeTime);
export default Vue.extend({
  data() {
    return {
      notifications: [] as AppNotification[],
      notReadCount: 0,
      menu: false,
    };
  },
  async fetch() {
    this.notifications = (
      await this.$axios.$get(this.$apiUrl.userNotification)
    ).notifications;
    this.notReadCount = this.notifications.filter(
      (noti) => !noti.isRead
    ).length;
  },
  methods: {
    async onMenu() {
      if (this.notReadCount === 0) return;
      await this.$handleErrors(async () => {
        await this.$axios.$put(this.$apiUrl.userNotification, { isRead: true });
        this.notReadCount = 0;
      });
    },
    getDateSubtitle(date: Date) {
      return dayjs(date).fromNow();
    },
  },
});
</script>
<style scoped>
.noti-list {
  height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
