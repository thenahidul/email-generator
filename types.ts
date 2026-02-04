
export interface Domain {
  id: string;
  domain: string;
  isPrivate: boolean;
  isActive: boolean;
}

export interface Account {
  id: string;
  address: string;
  password?: string;
  token?: string;
}

export interface Message {
  id: string;
  from: {
    address: string;
    name: string;
  };
  subject: string;
  intro: string;
  createdAt: string;
  seen: boolean;
}

export interface MessageDetail extends Message {
  text: string;
  html: string[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ACTIVE = 'ACTIVE',
  ERROR = 'ERROR'
}
