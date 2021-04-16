import { Plugin } from '@nuxt/types';
import io, { Socket } from 'socket.io-client';
declare module 'vue/types/vue' {
  interface Vue {
    $socket: Socket;
  }
}
declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $socket: Socket;
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $socket: Socket;
  }
}
// declare module 'vuex/types/index' {
//   interface Store<S> {
//     $apiUrl: ApiUrl;
//   }
// }
const socketPlugin: Plugin = ({ $config: { WS_URL } }, inject) => {
  const socket = io(WS_URL);
  inject('socket', socket);
};
export default socketPlugin;
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:3000');
// export default socket;
