import { Plugin } from '@nuxt/types';

const axiosPlugin: Plugin = ({ $axios, error: nuxtError, $toast }) => {
  // let isAuthRequest = false;
  // $axios.onRequest((config) => {
  //   if (config.url?.startsWith($apiUrl.user)) isAuthRequest = true;
  //   else isAuthRequest = false;
  // });
  function isString(thing: any) {
    if (thing && typeof thing === 'string') return thing;
    return null;
  }
  $axios.onError((error) => {
    $toast.error(
      'Error: ' +
        (isString(error.response?.data.message?.message) ||
          isString(error.response?.data.message) ||
          isString(error.message) ||
          'Server failed to response')
    );

    if (!error.response) {
      nuxtError({
        statusCode: 500,
        message: error.message,
      });
    }
    return Promise.reject(error);
  });

  // $axios.onRequest((config) => {
  //   if (store.state.auth && store.state.auth.user) {
  //     const zonePermissionGroups = store.state.auth.user.zonePermissionGroups;
  //     if (config.method === 'get') {
  //       if (config.params) {
  //         config.params.userPermissions = zonePermissionGroups;
  //       } else {
  //         config.params = { userPermissions: zonePermissionGroups };
  //       }
  //     } else {
  //       config.data.userPermissions = zonePermissionGroups;
  //     }
  //     console.log(config.method, config.params, config.data);
  //   }
  // });
};

export default axiosPlugin;
