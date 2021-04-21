import { Plugin } from '@nuxt/types';

const axiosPlugin: Plugin = ({ $axios, error: nuxtError, $toast }) => {
  $axios.onError((error) => {
    console.log('error:', error.response);

    $toast.error(
      'Error: ' +
        (error.response?.data.message ||
          error.message ||
          'Server failed to response')
    );
    if (!error.response) {
      nuxtError({
        statusCode: 500,
        message: error.message,
      });
    }
    return Promise.resolve(false);
  });
};

export default axiosPlugin;
