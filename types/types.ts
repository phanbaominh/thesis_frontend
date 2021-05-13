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
  zoneId: string | null;
  status: boolean;
}
export enum TypeUser {
  BuildingManager = 'bdManager',
  AdManager = 'adManager',
}
export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  adminId?: string;
  typeUser?: TypeUser;
}

export interface Subuser extends User {
  admin: string;
}

export enum Permission {
  ReadMedia = 1,
  WriteMedia,
  DeleteMedia,
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
export type Select = { text: string; value: any };

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
  ages: AdsetItem<number[]>;
  genders: AdsetItem<number[]>;
  daysOfWeek: AdsetItem<number[]>;
  hoursOfDay: AdsetItem<number[]>;
}
export const AdsetConst = {
  ranges: [
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
  Running = 'running',
  Rejected = 'rejected',
  Canceled = 'canceled',
}
export interface Ad {
  _id: string;
  name: string;
  adSetId: string;
  contentId: string;
  budget: number;
  bdManagerId: string;
  status?: string;
  timeDeploy?: Date;
  timeStatus?: Date;
  remainingBudget?: number;
}

export interface DetailedAd {
  _id: string;
  name: string;
  adSetId: Adset;
  contentId: { _id: string; name: string; mediaArray: string[] };
  budget: number;
  bdManagerId: User;
  adManagerId: User;
  status?: string;
}
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
}

export interface ZoneDeviceLog {
  name: string;
  mediaName: string | null;
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
}

export enum AnalyticsFrequency {
  Daily = 1,
  Monthly = 30,
}
export enum AnalyticsValue {
  Views = 'views',
  RunTime = 'runTime',
}

export interface AnalyticsData {
  name: string;
  views: number;
  runTime?: number;
  data: number[];
}

export interface AnalyticsQueryObject {
  [key: string]: any;
  value: AnalyticsValue;
  timeStart: number;
  frequency: AnalyticsFrequency;
  timeEnd: number;
}
