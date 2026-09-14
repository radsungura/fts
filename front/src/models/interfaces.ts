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
