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
            :disabled="notiLength === 0 ? true : false"
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
            <v-row no-gutters>
              <v-col class="mr-2">
                <v-icon :color="getNotiColor(noti.type)" small>
                  mdi-circle</v-icon
                >
              </v-col>
              <v-col>
                <VueMarkdown
                  :title="noti.text"
                  :source="getTruncatedNotiText(noti.text)"
                  class="noti-content"
                >
                </VueMarkdown>
              </v-col>
            </v-row>
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
import VueMarkdownx from 'vue-markdown/src/VueMarkdown';
import { AppNotification, NotiType } from '~/types/types';
const VueMarkdown = VueMarkdownx as any;
dayjs.extend(relativeTime);
export default Vue.extend({
  components: { VueMarkdown },
  data() {
    return {
      notifications: [] as AppNotification[],
      notiLength: 0,
      notReadCount: 0,
      menu: false,
    };
  },
  async fetch() {
    this.notifications = (
      await this.$axios.$get(this.$apiUrl.userNotification)
    ).notifications;
    this.notiLength = this.notifications.length;
    this.notReadCount = this.notifications.filter(
      (noti) => !noti.isRead
    ).length;
  },
  created() {
    this.$socket.on('notification', (newNoti) => {
      this.notifications.unshift(newNoti);
      this.notiLength += 1;
      this.notReadCount += 1;
    });
  },
  beforeDestroy() {
    this.$socket.off('notification');
  },
  methods: {
    getTruncatedNotiText(text: string) {
      return this.$truncate(text, 70);
    },
    async onMenu() {
      if (this.notReadCount === 0) return;
      await this.$handleErrors(async () => {
        await this.$axios.$put(this.$apiUrl.userNotification, { isRead: true });
        this.notReadCount = 0;
        this.$nuxt.$loading.finish();
      });
    },
    getDateSubtitle(date: string) {
      return dayjs(date).fromNow();
    },
    getNotiColor(type: NotiType) {
      if (type === NotiType.Info) {
        return 'blue';
      } else if (type === NotiType.Warn) {
        return 'red';
      } else if (type === NotiType.Success) {
        return 'green';
      }
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
.noti-content {
  width: 300px;
  display: inline-block;
  word-wrap: break-word;
}
</style>
