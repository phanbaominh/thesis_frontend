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
  name: string;
  serialNumber: string;
  zoneId: string;
}
export interface Zone {
  _id: string;
  name: string;
  playlistArray: Playlist[];
  videoArray: Video[];
  deviceArray: Device[];
  volumeVideo: number;
}
