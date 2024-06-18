export interface History {
  id: string;
  cropId: string;
  statId: string;
  history_date: Date;
  num_stat: number;
  isDanger: boolean;
  description: string;
}

export interface CreateHistory {
  cropId: string;
  statId: string;
  num_stat: number;
  isDanger: boolean;
  description: string;
}
