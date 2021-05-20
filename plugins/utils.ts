import { Plugin } from '@nuxt/types';
import dayjs from 'dayjs';
const utils = {
  timeFormat(time: number | Date | string | null | undefined): string {
    const formatString = 'HH:MM - DD/MM/YYYY';
    if (!time) return 'Unknown';
    console.log('time1', time);
    if (time instanceof Date || typeof time === 'string')
      return dayjs(time).format(formatString);
    console.log('time2', time);
    return dayjs.unix(time).format(formatString);
  },
};
declare module 'vue/types/vue' {
  interface Vue {
    $utils: typeof utils;
  }
}
declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $utils: typeof utils;
  }
  interface Context {
    $utils: typeof utils;
  }
}
// declare module 'vuex/types/index' {
//   interface Store<S> {
//     $apiUrl: ApiUrl;
//   }
// }
const filterPlugin: Plugin = (_, inject) => {
  inject('utils', utils);
};
export default filterPlugin;
