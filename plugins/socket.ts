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
const socketPlugin: Plugin = (
  { $config: { WS_URL }, $toast, store },
  inject
) => {
  const socket = io(WS_URL);
  let hasToast = false;
  socket.on('connect_error', () => {
    if (!hasToast)
      $toast.error("Couldn't establish socket connection with server");
    hasToast = true;
  });
  socket.on('connect', () => {
    store.commit('CHANGE_SOCKET_STATUS', true);
  });
  socket.on('disconnect', () => {
    store.commit('CHANGE_SOCKET_STATUS', false);
  });
  inject('socket', socket);
};
export default socketPlugin;
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:3000');
// export default socket;
