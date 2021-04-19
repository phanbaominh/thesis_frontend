/* eslint-disable @typescript-eslint/no-unused-vars */
import { Plugin } from '@nuxt/types';

type Url = string;
interface IdToUrl {
  (id: string): Url;
}
interface ApiUrl {
  zones: Url;
  zone: IdToUrl;
  playlists: Url;
  playlist: IdToUrl;
  videos: Url;
  video: IdToUrl;
  videoArray: Url;
  devices: Url;
  device: IdToUrl;
}

declare module 'vue/types/vue' {
  interface Vue {
    $apiUrl: ApiUrl;
  }
}
declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $apiUrl: ApiUrl;
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $apiUrl: ApiUrl;
  }
}
declare module 'vuex/types/index' {
  interface Store<S> {
    $apiUrl: ApiUrl;
  }
}
const apiPlugin: Plugin = ({ $config: { apiURL } }, inject) => {
  const zonesUrl = `${apiURL}/zones`;
  const playlistUrl = `${apiURL}/playlists`;
  const videoUrl = `${apiURL}/videos`;
  const deviceUrl = `${apiURL}/devices`;
  inject('apiUrl', {
    zones: zonesUrl,
    zone: (id: string) => `${zonesUrl}/${id}`,
    playlists: playlistUrl,
    playlist: (id: string) => `${playlistUrl}/${id}`,
    videos: videoUrl,
    video: (id: string) => `${videoUrl}/${id}`,
    videoArray: `${videoUrl}/get-many`,
    devices: deviceUrl,
    device: (id: string) => `${deviceUrl}/${id}`,
  });
};

export default apiPlugin;
