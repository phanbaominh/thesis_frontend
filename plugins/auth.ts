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
    options?: {
      zoneId?: string;
      satisfyOne?: boolean;
      isToasting?: boolean;
      isLogging?: boolean;
    }
  ): boolean;
}

type canFunction = () => boolean;
interface PermissionPlugin {
  check: CheckPermission;
  DevicePermissions: Permission[];
  ZonePermissions: Permission[];
  MediaPermissions: Permission[];
  PermPermissions: Permission[];
  canGeneralReadDevice: canFunction;
  canGeneralWriteZone: canFunction;
  canGeneralReadZone: canFunction;
  canGeneralReadMedia: canFunction;
  canGeneralWriteMedia: canFunction;
  canGeneralDeleteMedia: canFunction;
  isAdmin: canFunction;
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
  function logto(isLogging: boolean) {
    return (...value: any) => {
      if (isLogging) {
        console.log(...value);
      }
      return true;
    };
  }
  const check: CheckPermission = (
    requiredPermissions: number | number[],
    options?: {
      zoneId?: string;
      satisfyOne?: boolean;
      isToasting?: boolean;
      isLogging?: boolean;
    }
  ): boolean => {
    if ($auth.user && $auth.user.zonePermissionGroups) {
      // eslint-disable-next-line prefer-const
      const defaultOptions = {
        zoneId: $auth.user.generalZoneId as string,
        satisfyOne: true,
        isToasting: false,
        isLogging: false,
      };
      const finalOptions = { ...defaultOptions, ...options };

      const { zoneId, satisfyOne, isToasting, isLogging } = finalOptions;
      const logto2 = logto(isLogging);
      logto2('');
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
          if (possessedPerms.find((ps) => ps.find((ele) => ele === perm))) {
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

  const canGeneralReadDevice = () => {
    return check(DevicePermissions);
  };

  const canGeneralWriteZone = () => {
    return check(Permission.WriteZone);
  };

  const canGeneralReadZone = () => {
    return check(ZonePermissions);
  };

  const canGeneralReadMedia = () => {
    return check(MediaPermissions);
  };

  const canGeneralWriteMedia = () => {
    return check(MediaPermissions);
  };

  const canGeneralDeleteMedia = () => {
    return check(MediaPermissions);
  };

  inject('permission', {
    check,
    DevicePermissions,
    PermPermissions,
    MediaPermissions,
    ZonePermissions,
    canGeneralReadDevice,
    canGeneralReadZone,
    canGeneralWriteZone,
    canGeneralReadMedia,
    canGeneralWriteMedia,
    canGeneralDeleteMedia,
  } as PermissionPlugin);
};
export default socketPlugin;
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:3000');
// export default socket;
