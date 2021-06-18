export interface AdsetItem<T> {
  value: T;
  strict: boolean;
}
export interface Nameable {
  _id: string;
  name: string;
}
export interface Media {
  _id: string;
  name: string;
  path: string;
  adSetId: {
    ages: AdsetItem<number[]>;
    genders: AdsetItem<number[]>;
  };
}

export interface FetchState {
  error: Error | null;
  pending: boolean;
  timestamp: number;
}

export interface Tag {
  name: string;
}
export interface Video {
  _id: string;
  name: string;
  path: string;
  size: number;
  duration: number;
  tag: Tag[];
  cDate: Date;
  mDate: Date;
}

export interface Playlist {
  _id: string;
  name: string;
  type: string;
  mediaArray: string[];
}

export interface Device {
  _id: string;
  name: string;
  serialNumber: string;
  zoneId: { _id: string; name: string } | null;
  status: boolean;
  timeStatusChange: string;
}
export enum TypeUser {
  BuildingManager = 'bdManager',
  AdManager = 'adManager',
}
export interface User {
  _id: string;
  username: string;
  email: string;
  desc: string;
  avatar: string;
  password: string;
  adminId?: string;
  typeUser?: TypeUser;
}

export interface Subuser extends User {
  admin: string;
}

export enum Permission {
  ReadAd = 1,
  WriteAd,
  DeleteAd,
  ReadDevice,
  WriteDevice,
  DeleteDevice,
  ReadZone,
  WriteZone,
  DeleteZone,
  ControlZone,
  ReadPermission,
  WritePermission,
  DeletePermission,
  ReadAnalytics,
}
export type PermissionName = keyof typeof Permission;
export type PermissionTabItem = { [key in PermissionName]?: boolean };
export interface PermissionGroup {
  _id: string;
  name: string;
  permissions: Permission[];
  desc: string;
}

export interface ZonePermissionGroup {
  zone: { _id: string; name: string };
  permissionGroups: { _id: string; name: string; relationId: string }[];
}

export interface DetailedZonePermissionGroup {
  zone: { _id: string; name: string };
  permissionGroups: {
    _id: string;
    name: string;
    relationId: string;
    permissions: number[];
  }[];
}
export interface ZoneSubuser {
  zone: { _id: string; name: string };
  users: { _id: string; username: string; relationId: string }[];
}

export interface SubuserPermissionGroup {
  user: { _id: string; username: string };
  permissionGroups: { _id: string; name: string; relationId: string }[];
}
export type Select = { text: string; value: any; [key: string]: any };

export interface PermissionRelation {
  _id: string;
  zone: string;
  permissionGroup: string;
  user: string;
  adminId: string;
}

export interface Adset {
  _id: string;
  name: string;
  ages?: AdsetItem<number[]>;
  genders?: AdsetItem<number[]>;
  daysOfWeek?: AdsetItem<number[]>;
  hoursOfDay?: AdsetItem<number[]>;
}
export const AdsetConst = {
  ages: [
    '0-2',
    '3-9',
    '10-19',
    '20-29',
    '30-39',
    '40-49',
    '50-59',
    '60-69',
    '70+',
  ],
  dows: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ],
  hods: [...Array(24).keys()],
};
export enum AdsetGender {
  Male = 10,
  Female = 11,
}
export enum AdStatus {
  Pending = 'pending',
  Deployed = 'deployed',
  Idle = 'idle',
  Empty = 'empty',
  Finished = 'finished',
}
export interface Ad {
  _id: string;
  name: string;
  adSetId: string;
  contentId: string;
  budget: number;
  zoneIds: string[];
  bdManagerId: string;
  status?: string;
  timeCreate?: string;
  timeStatus?: string;
  remainingBudget?: number;
}

export interface AdTableRow extends Ad {
  views: number;
  cost: number;
  runTime: number;
  avgViews: number;
  avgRunTime: number;
}

export interface DeviceTableRow {
  _id: string;
  name: string;
  cost: number;
  views: number;
  ad: { _id: string; name: string };
  avgViews: number;
  numberOfTimes: number;
  media?: { path: string; name: string };
  timeStart: number;
  volumeVideo: number;
  isPause: boolean;
}
//
export type ArrayElement<
  ArrayType extends readonly unknown[]
> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
export type ZoneArrayable = 'device' | 'ad';
export type ZoneArrayType = `${ZoneArrayable}Array`;

export interface ZoneInfo {
  deviceId?: string;
  durationFull: number;
  isFinishInit: boolean;
  isMute: boolean;
  isPause: boolean;
  isPlaylistRunning: boolean;
  isVideoPlaying: boolean;
  loopMode: number;
  playlistVideoId?: string;
  position: number;
  videoId?: string;
  volumeVideo: number;
  zoneId: string;
  isScheduleRunning: boolean;
  scheduleId: string;
  mediaName: string;
  timeStart: number;
  adName: string;
}

export interface ZoneDeviceLog {
  name: string;
  mediaName: string | null;
  adName: string;
  timeStart: string;
}

export interface Zone {
  _id: string;
  name: string;
  playlistArray: Playlist[];
  videoArray: Video[];
  adArray: Ad[];
  deviceArray: Device[];
  volumeVideo: number;
  isMuteVideo: boolean;
  isLoopOneVideo: boolean;
  isLoopAllVideo: boolean;
  location: { lat: number; lng: number };
  locationDesc: string;
  pricePerTimePeriod: number;
}
export interface DetailedAd {
  _id: string;
  name: string;
  adSetId: Adset;
  contentId: { _id: string; name: string; mediaArray: string[] };
  budget: number;
  remainingBudget: number;
  bdManagerId: User;
  adManagerId: User;
  zoneIds: Zone[];
  status?: string;
  timeStatus: string;
}
export enum AnalyticsFrequency {
  Daily = 1,
  Monthly = 30,
}
export enum AnalyticsValue {
  Views = 'views',
  RunTime = 'runTime',
  Cost = 'moneyCharge',
}

export interface AnalyticsData {
  name: string;
  views: number;
  cost: number;
  runTime?: number;
  avgRunTime?: number;
  avgViews?: number;
  data: number[];
}

export type AnalyticsDataHeader = Exclude<keyof AnalyticsData, 'name' | 'data'>;
export interface AnalyticsQueryObject {
  [key: string]: any;
  value: AnalyticsValue;
  timeStart: number;
  frequency: AnalyticsFrequency;
  timeEnd: number;
}

export enum NotiType {
  Info = 'info',
  Success = 'success',
  Warn = 'warn',
}
export interface AppNotification {
  _id: string;
  text: string;
  type: NotiType;
  isRead: boolean;
  cTime: string;
  link: string;
}
interface NameIdable {
  name: string;
  _id: string;
}

export interface AdLog {
  ad: NameIdable;
  bdManager: { _id: string; username: string };
  video: NameIdable;
  device: NameIdable;
  zone: NameIdable;
  timeStart: number;
  runTime: number;
  views: number;
  ages: number[];
  genders: number[];
  cost: number;
  image: string;
}
