
export interface Employee {
  id: string;
  name: string;
}

export interface Winner {
  name: string;
  timestamp: Date;
  prize?: string;
}

export interface Group {
  id: string;
  name: string;
  members: string[];
}

export type Tab = 'names' | 'lottery' | 'grouping';
