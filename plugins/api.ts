import { Plugin } from '@nuxt/types';

type Url = string;
interface IdToUrl {
  (id: string): Url;
}
interface ApiUrl {
  zones: Url;
  zone: IdToUrl;
  playlists: Url;
  videos: Url;
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
// declare module 'vuex/types/index' {
//   interface Store<S> {
//     $apiUrl: ApiUrl;
//   }
// }
const apiPlugin: Plugin = ({ $config: { apiURL } }, inject) => {
  const zonesUrl = `${apiURL}/zones`;
  const playlistUrl = `${apiURL}/playlists`;
  const videoUrl = `${apiURL}/videos`;
  inject('apiUrl', {
    zones: zonesUrl,
    zone: (id: string) => `${zonesUrl}/${id}`,
    playlists: playlistUrl,
    videos: videoUrl,
  });
};

export default apiPlugin;
