import { Plugin } from '@nuxt/types';

const axiosPlugin: Plugin = ({ $axios, error: nuxtError }) => {
  $axios.onError((error) => {
    console.log('error:', error);
    nuxtError({
      statusCode: error.response?.status || 500,
      message: error.response?.data.message || error.message,
    });
    return Promise.resolve(false);
  });
};

export default axiosPlugin;
