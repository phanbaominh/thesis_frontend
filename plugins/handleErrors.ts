import { Plugin } from '@nuxt/types';

interface TypeOfHandleErrors {
  (callback: Function, errorCb?: (err: any) => void): void;
}
declare module 'vue/types/vue' {
  interface Vue {
    $handleErrors: TypeOfHandleErrors;
  }
}
declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $handleErrors: TypeOfHandleErrors;
  }
  interface Context {
    $handleErrors: TypeOfHandleErrors;
  }
}
// declare module 'vuex/types/index' {
//   interface Store<S> {
//     $apiUrl: ApiUrl;
//   }
// }
const filterPlugin: Plugin = ({ error: nuxtError }, inject) => {
  const handleErrors = async (
    callback: Function,
    errorCb?: (err: any) => void
  ) => {
    try {
      await callback();
    } catch (err) {
      if (errorCb) errorCb(err);
      if (!err.isAxiosError) {
        if (process.env.env !== 'production') console.log(err);
        nuxtError({
          statusCode: 500,
          message: 'Internal server error',
        });
      }
    }
  };
  inject('handleErrors', handleErrors);
};
export default filterPlugin;
