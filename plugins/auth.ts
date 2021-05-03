import { Plugin } from '@nuxt/types';
import { DetailedZonePermissionGroup, Permission } from '~/types/types';
const DevicePermissions = [
  Permission.ReadDevice,
  Permission.DeleteDevice,
  Permission.ReadDevice,
];

const ZonePermissions = [
  Permission.WriteZone,
  Permission.ReadZone,
  Permission.DeleteZone,
  Permission.ControlZone,
];

const MediaPermissions = [
  Permission.ReadMedia,
  Permission.WriteMedia,
  Permission.DeleteMedia,
];

const PermPermissions = [
  Permission.ReadPermission,
  Permission.DeletePermission,
  Permission.WritePermission,
];

interface CheckPermission {
  (
    requiredPermissions: number | number[],
    options?: { zoneId?: string; satisfyOne?: boolean; isToasting?: boolean }
  ): boolean;
}
interface PermissionPlugin {
  check: CheckPermission;
  DevicePermissions: Permission[];
  ZonePermissions: Permission[];
  MediaPermissions: Permission[];
  PermPermissions: Permission[];
}
declare module 'vue/types/vue' {
  interface Vue {
    $permission: PermissionPlugin;
  }
}
declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $permission: PermissionPlugin;
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $permission: PermissionPlugin;
  }
}
// declare module 'vuex/types/index' {
//   interface Store<S> {
//     $apiUrl: ApiUrl;
//   }
// }
const socketPlugin: Plugin = ({ $toast, $auth }, inject) => {
  const toastError = (isToasting: boolean) => {
    if (isToasting) $toast.error("You don't have permission to do this");
  };
  const check: CheckPermission = (
    requiredPermissions: number | number[],
    options?: {
      zoneId?: string;
      satisfyOne?: boolean;
      isToasting?: boolean;
    }
  ): boolean => {
    if ($auth.user && $auth.user.zonePermissionGroups) {
      // eslint-disable-next-line prefer-const
      const defaultOptions = {
        zoneId: $auth.user.generalZoneId as string,
        satsifyOne: true,
        isToasting: true,
      };
      const finalOptions = { ...defaultOptions, ...options };
      const { zoneId, satisfyOne, isToasting } = finalOptions;
      if (!$auth.user.adminId) return true;
      const zonePermissionGroups = $auth.user
        .zonePermissionGroups as DetailedZonePermissionGroup[];
      const foundZonePermGroup = zonePermissionGroups.find(
        (zpg) => zpg.zone._id === zoneId
      );
      if (!foundZonePermGroup) {
        toastError(isToasting);
        return false;
      } else {
        if (typeof requiredPermissions === 'number')
          requiredPermissions = [requiredPermissions];
        const possessedPerms = foundZonePermGroup.permissionGroups.map(
          (pg) => pg.permissions
        );
        for (const perm of requiredPermissions) {
          if (possessedPerms.find((ps) => ps.includes(perm))) {
            if (satisfyOne) return true;
          } else if (!satisfyOne) {
            toastError(isToasting);
            return false;
          }
        }
        if (satisfyOne) {
          toastError(isToasting);
          return false;
        } else return true;
      }
    }
    return false;
  };
  inject('permission', {
    check,
    DevicePermissions,
    PermPermissions,
    MediaPermissions,
    ZonePermissions,
  } as PermissionPlugin);
};
export default socketPlugin;
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:3000');
// export default socket;
