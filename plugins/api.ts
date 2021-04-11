import { Plugin } from '@nuxt/types';

type Url = string;
interface ApiUrl {
  getZone: Url;
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
  const articlesUrl = `${apiURL}/api/articles`;
  const articleUrl = (slug: string) => `${articlesUrl}/${slug}`;
  inject('apiUrl', {
    getArticle: (slug: string) => articleUrl(slug),
  });
};

export default apiPlugin;
