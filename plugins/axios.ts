import { Plugin } from '@nuxt/types';

const axiosPlugin: Plugin = ({ $axios, error: nuxtError, $toast }) => {
  // let isAuthRequest = false;
  // $axios.onRequest((config) => {
  //   if (config.url?.startsWith($apiUrl.user)) isAuthRequest = true;
  //   else isAuthRequest = false;
  // });
  $axios.onError((error) => {
    console.log('error:', { ...error });
    $toast.error(
      'Error: ' +
        (error.response?.data.message?.message ||
          error.response?.data.message ||
          error.message ||
          'Server failed to response')
    );

    if (!error.response) {
      nuxtError({
        statusCode: 500,
        message: error.message,
      });
    }
    // return Promise.resolve(false);
  });

  // $axios.onRequest((config) => {
  //   if (store.state.auth && store.state.auth.user) {
  //     config.headers.Authorization = `Bearer ${store.state.auth.user.token}`;
  //   }
  // });
};

export default axiosPlugin;
