/* eslint-disable @typescript-eslint/no-unused-vars */
import { Plugin } from '@nuxt/types';

type Url = string;
interface IdToUrl {
  (id: string): Url;
}
interface ApiUrl {
  zones: Url;
  zone: IdToUrl;
  zoneAddDevice: Url;
  zoneDeleteDevice: Url;
  zoneLogs: IdToUrl;
  playlists: Url;
  playlist: IdToUrl;
  playlistPreview: IdToUrl;
  videos: Url;
  video: IdToUrl;
  videoArray: Url;
  videoInfo: Url;
  videoControl: Url;
  devices: Url;
  device: IdToUrl;
  user: Url;
  userUpdate: Url;
  userTypeUser: Url;
  userNotification: Url;
  buildingManagers: Url;
  permGroups: Url;
  permGroup: IdToUrl;
  userPerms: Url;
  userPerm: IdToUrl;
  userPermInsertMany: Url;
  userPermDeleteMany: Url;
  userPermDeleteZone: Url;
  userPermSubuser: IdToUrl;
  userPermZone: IdToUrl;
  userPermPermGroup: IdToUrl;
  subusers: Url;
  subuser: IdToUrl;
  adsets: Url;
  adsBelongTo: Url;
  adset: IdToUrl;
  ads: Url;
  adsTableFormatByAd: Url;
  adsTableFormatByBd: Url;
  adsAdManager: Url;
  adsBdManager: Url;
  ad: IdToUrl;
  adStatus: IdToUrl;
  adStatusCancel: IdToUrl;
  adStatusSend: IdToUrl;
  adStatusRedeploy: IdToUrl;
  adStatusDeploy: IdToUrl;
  adStatusReject: IdToUrl;
  adDetailed: IdToUrl;
  analyticsOverview: Url;
  analyticsAdOffer: Url;
  analyticsBdManager: Url;
  analyticsAge: Url;
  analyticsGender: Url;
  bdManagerZoneInfo: IdToUrl;
  logs: Url;
}

declare module 'vue/types/vue' {
  interface Vue {
    $apiUrl: ApiUrl;
  }
}
declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $apiUrl: ApiUrl;
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $apiUrl: ApiUrl;
  }
}
declare module 'vuex/types/index' {
  // eslint-disable-next-line no-unused-vars
  interface Store<S> {
    $apiUrl: ApiUrl;
  }
}
const apiPlugin: Plugin = ({ $config: { apiURL } }, inject) => {
  const zonesUrl = `${apiURL}/zones`;
  const playlistUrl = `${apiURL}/playlists`;
  const videoUrl = `${apiURL}/videos`;
  const videoControlUrl = `${apiURL}/video-control`;
  const deviceUrl = `${apiURL}/devices`;
  const permGroupUrl = `${apiURL}/perm-groups`;
  const userPermUrl = `${apiURL}/user-perms`;
  const usersUrl = `${apiURL}/users`;
  const subusersUrl = `${usersUrl}/subusers`;
  const adsetsUrl = `${apiURL}/adsets`;
  const adsUrl = `${apiURL}/adoffers`;
  const analyticsUrl = `${apiURL}/analytics`;
  inject('apiUrl', {
    zones: zonesUrl,
    zone: (id: string) => `${zonesUrl}/${id}`,
    zoneLogs: (id: string) => `${zonesUrl}/${id}/logs`,
    zoneAddDevice: `${zonesUrl}/add-device`,
    zoneDeleteDevice: `${zonesUrl}/remove-device`,
    playlists: playlistUrl,
    playlist: (id: string) => `${playlistUrl}/${id}`,
    videos: videoUrl,
    video: (id: string) => `${videoUrl}/${id}`,
    videoControl: `${videoControlUrl}`,
    videoInfo: `${videoControlUrl}/get-infor-video`,
    videoArray: `${videoUrl}/get-many`,
    devices: deviceUrl,
    device: (id: string) => `${deviceUrl}/${id}`,
    user: `${usersUrl}`,
    userUpdate: `${usersUrl}/update`,
    userTypeUser: `${usersUrl}/type-user`,
    userNotification: `${usersUrl}/notifications`,
    permGroups: permGroupUrl,
    permGroup: (id: string) => `${permGroupUrl}/${id}`,
    userPerms: userPermUrl,
    userPerm: (id: string) => `${userPermUrl}/${id}`,
    userPermInsertMany: `${userPermUrl}/insert-many`,
    userPermDeleteMany: `${userPermUrl}/delete-many-by-perm-groups`,
    userPermDeleteZone: `${userPermUrl}/delete-zone`,
    userPermSubuser: (id: string) => `${userPermUrl}/subusers/${id}`,
    userPermZone: (id: string) => `${userPermUrl}/zones/${id}`,
    userPermPermGroup: (id: string) => `${userPermUrl}/perm-groups/${id}`,
    subusers: subusersUrl,
    subuser: (id: string) => `${subusersUrl}/${id}`,
    adsets: adsetsUrl,
    adset: (id: string) => `${adsetsUrl}/${id}`,
    ads: adsUrl,
    adsTableFormatByAd: `${adsUrl}/table-ad`,
    adsTableFormatByBd: `${adsUrl}/table-bd`,
    adsBelongTo: `${adsUrl}/belong-to`,
    adsAdManager: `${adsUrl}/ad-manager`,
    adsBdManager: `${adsUrl}/bd-manager`,
    ad: (id: string) => `${adsUrl}/${id}`,
    playlistPreview: (id: string) => `${playlistUrl}/${id}/preview`,
    adDetailed: (id: string) => `${adsUrl}/full-infor/${id}`,
    adStatus: (id: string) => `${adsUrl}/status/${id}`,
    adStatusCancel: (id: string) => `${adsUrl}/${id}/cancel`,
    adStatusSend: (id: string) => `${adsUrl}/${id}/send`,
    adStatusRedeploy: (id: string) => `${adsUrl}/${id}/redeploy`,
    adStatusDeploy: (id: string) => `${adsUrl}/${id}/deploy`,
    adStatusReject: (id: string) => `${adsUrl}/${id}/reject`,
    analyticsOverview: `${analyticsUrl}/overview`,
    analyticsAdOffer: `${analyticsUrl}/adOffer`,
    analyticsBdManager: `${analyticsUrl}/bdManager`,
    analyticsAge: `${analyticsUrl}/age`,
    analyticsGender: `${analyticsUrl}/gender`,
    bdManagerZoneInfo: (id: string) =>
      `${usersUrl}/bd-managers/${id}/zone-info`,
    logs: `${analyticsUrl}`,
  });
};

export default apiPlugin;
