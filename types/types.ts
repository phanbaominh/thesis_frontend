export interface Nameable {
  _id: string;
  name: string;
}
export interface Media {
  _id: string;
  name: string;
  path: string;
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
export type ArrayElement<
  ArrayType extends readonly unknown[]
> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
export type ZoneArrayable = 'video' | 'playlist' | 'device';
export type ZoneArrayType = `${ZoneArrayable}Array`;
export interface Zone {
  _id: string;
  name: string;
  playlistArray: Playlist[];
  videoArray: Video[];
  deviceArray: Device[];
  volumeVideo: number;
  isMuteVideo: boolean;
  isLoopOneVideo: boolean;
  isLoopAllVideo: boolean;
}
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

export interface User {
  username: string;
  email: string;
  password: string;
}

export enum Permission {
  ReadMedia = 1,
  WriteMedia,
  DeleteMedia,
}
export type PermissionName = keyof typeof Permission;
export type PermissionTabItem = { [key in PermissionName]?: boolean };
export interface PermissionGroup {
  _id: string;
  name: string;
  permissions: Permission[];
  desc: string;
}
