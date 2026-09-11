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

export interface Category {
  id?: number;
  name: string;
  description: string;
  createdAt?: string;
}

export interface Location {
  id?: number;
  name: string;
  code: string;
  address: string;
  status: string;
  category: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

