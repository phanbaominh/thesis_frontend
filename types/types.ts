export interface Device {
  [key: string]: string;
  name: string;
  serial: string;
  type: string;
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
