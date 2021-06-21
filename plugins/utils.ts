import { Plugin } from '@nuxt/types';
import dayjs from 'dayjs';
const utils = {
  timeFormat(time: number | Date | string | null | undefined): string {
    const formatString = 'HH:mm:ss - DD/MM/YYYY';
    if (!time) return 'Unknown';
    if (time instanceof Date || typeof time === 'string')
      return dayjs(time).format(formatString);
    return dayjs.unix(time).format(formatString);
  },
  moneyFormat(amount: number, currency = 'VND'): string {
    amount = Number(amount);
    const isInteger = Number.isInteger(amount);
    const amountString = isInteger ? amount.toString() : amount.toFixed(2);
    const stringArray = isInteger
      ? amountString.split('')
      : amountString.split('.')[0].split('');
    const tail =
      (isInteger ? '' : '.' + amountString.split('.')[1]) + ' ' + currency;
    const n = stringArray.length - 1;
    return (
      stringArray.reduceRight((acc, val, i) => {
        const y = Math.abs(i - n) % 3;
        if (y === 0 && Math.abs(i - n) !== 0) return val + ',' + acc;
        return val + acc;
      }, '') + tail
    );
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
