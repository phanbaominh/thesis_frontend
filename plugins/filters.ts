import { Plugin } from '@nuxt/types';
const truncate = (name: string, length = 25) => {
  if (name.length > length) {
    return name.substring(0, length) + '...';
  }
  return name;
};
declare module 'vue/types/vue' {
  interface Vue {
    $truncate: typeof truncate;
  }
}
declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $truncate: typeof truncate;
  }
  interface Context {
    $truncate: typeof truncate;
  }
}
// declare module 'vuex/types/index' {
//   interface Store<S> {
//     $apiUrl: ApiUrl;
//   }
// }
const filterPlugin: Plugin = (_, inject) => {
  inject('truncate', truncate);
};
export default filterPlugin;
