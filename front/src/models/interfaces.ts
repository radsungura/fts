export interface Doc {
  id?: number;
  title: string;
  reference: string;
  category: string;
  location: string;
  status: string;
  createdAt?: string;
}

export interface Mov {
  id?: number;
  title: string;
  reference: string;
  category: string;
  location: string;
  status: string;
  createdAt?: string;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt?: string;
}
