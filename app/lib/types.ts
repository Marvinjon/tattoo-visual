export interface TattooImage {
  id: string;
  url: string;
  name: string;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  size?: number;
  rotation?: number;
} 