export interface Doc {
  id?: string;
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
  id?: string;
  documentId?: string;
  documentTitle: string;
  borrower: string;
  service: string;
  returned_by: string;
  bcreated_by: string;
  rcreated_by: string;
  bdesc: string;
  rdesc: string;
  borrowDate: Date;
  returnDate: Date;
  returned_at: Date;
  status: 'Emprunté' | 'En retard' | 'Retourné';
}

export interface User {
  id?: number;
  uname: string;
  fname: string;
  lname: string;
  email: string;
  pass: string;
  passtemp: string;
  role: string;
  status: string;
  created_at?: string;
  updated_at?: string;
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
  created_at?: Date;
  updated_at?: Date;
}

export type DateInput = 
    | Date 
    | string 
    | number 
    | [number, number, number, number?, number?, number?]
    | {
        year: number;
        month?: number;
        day?: number;
        hours?: number;
        hour?: number;
        minutes?: number;
        minute?: number;
        seconds?: number;
        second?: number;
    };