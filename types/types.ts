export interface Device {
  [key: string]: string;
  name: string;
  serialNumber: string;
  deviceType: string;
}

export interface Zone {
  name: string;
}
