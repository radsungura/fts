export interface Doc {
  id?: number;
  title: string;
  reference: string;
  code: string;
  category: string;
  location: string;
  desc: string;
  dept_id: string;
  box_id: string;
  status: string;
  created_by?: string;
  updated_by: string;
  created_at?: string;
  updated_at: string;
  
}

export interface Mov {
  id?: number;
  documentId?: number;
  documentTitle: string;
  borrower: string;
  borrowDate: string;
  returnDate: string;
  status: 'Emprunté' | 'En retard' | 'Retourné';
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
  desc: string;
  createdAt?: string;
}

export interface Location {
  id?: number;
  name: string;
  code: string;
  address: string;
  status: string;
  category: number;
  parent_id: number;
  desc: string;
  created_at?: string;
  updated_at?: string;
}

