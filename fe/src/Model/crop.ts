export interface Crop {
  id: string;
  pondId?: string;
  type: string;
  number: number;
  startDate?: Date;
}

export interface CreateCrop {
  pondId: string;
  type: string;
  number: number;
}

export interface updateCrop extends CreateCrop {
  id: string;
}

export interface CropStat {
  cropId: string;
  statId: string;
  isActive: number;
  iotId?: any;
}
