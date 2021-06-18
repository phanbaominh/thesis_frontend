// import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - thesis_frontend',
    title: 'thesis_frontend',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      {
        hid: 'viewport',
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/api.ts',
    '~/plugins/filters.ts',
    '~/plugins/axios.ts',
    '~/plugins/chart.ts',
    '~/plugins/handleErrors.ts',
    '~/plugins/utils.ts',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    'nuxt-typed-vuex',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/toast',
    '@nuxtjs/auth-next',
    'nuxt-leaflet',
  ],
  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          // required: true,
          // type: 'Bearer'
        },
        user: {
          property: 'user',
          // autoFetch: true
        },
        endpoints: {
          login: {
            url: `${
              process.env.API_URL || 'http://localhost:3000/api'
            }/users/sign-in`,
            method: 'post',
          },
          logout: false,
          user: {
            url: `${
              process.env.API_URL || 'http://localhost:3000/api'
            }/users/current-user`,
            method: 'get',
          },
        },
      },
    },
    plugins: ['~/plugins/socket.ts', '~/plugins/auth.ts'],
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      // dark: true,
      // themes: {
      //   dark: {
      //     primary: colors.blue.darken2,
      //     accent: colors.grey.darken3,
      //     secondary: colors.amber.darken3,
      //     info: colors.teal.lighten1,
      //     warning: colors.amber.base,
      //     error: colors.deepOrange.accent4,
      //     success: colors.green.accent3,
      //   },
      // },
    },
  },
  publicRuntimeConfig: {
    WS_URL: process.env.WS_URL || 'http://localhost:3000',
    apiURL: process.env.API_URL || 'http://localhost:3000/api',
  },
  env: {
    MAP_API_KEY: process.env.MAP_API_KEY,
  },
  server: {
    port: process.env.PORT || 8000,
  },
  ssr: false,
  toast: {
    duration: 3000,
    position: 'top-right',
    keepOnHover: true,
    theme: 'toasted-primary',
    containerClass: 'custom-toast-container',
    className: 'custom-toast-content',
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  router: {
    middleware: ['auth'],
  },
  loading: {
    color: 'royalblue',
    height: '3px',
  },
};
