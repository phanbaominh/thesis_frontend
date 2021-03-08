export interface Device {
  [key: string]: string;
  name: string;
  serialNumber: string;
  deviceType: string;
}
export interface Zone {
  name: string;
}

export interface Media {
  name: string;
}
export interface Playlist {
  name: string;
  mediaArray: Media[];
}

export interface FetchState {
  error: Error | null;
  pending: boolean;
  timestamp: number;
}
