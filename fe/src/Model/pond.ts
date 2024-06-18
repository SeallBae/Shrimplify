export interface Pond {
  id: string;
  userName: string;
  name: string;
  area: number;
  deep: string;
  startDate: Date;
}

export interface CreatePond {
  userName?: string;
  name: string;
  area: number;
  deep: number;
  startDate?: Date;
}

export interface UpdatePond extends CreatePond {
  id: string;
}
