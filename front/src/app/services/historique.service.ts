import { Injectable } from '@angular/core';

export type HistoriqueAction =
  | 'Création'
  | 'Modification'
  | 'Suppression'
  | 'Emprunt'
  | 'Retour'
  | 'Archivage';

export interface HistoriqueEntry {
  id: string;
  date: string;
  action: HistoriqueAction;
  document: string;
  reference?: string;
  utilisateur: string;
  details: string;
}

@Injectable({
  providedIn: 'root',
})
export class HistoriqueService {
  private readonly storageKey = 'fts_historique_v1';

  getAll(): HistoriqueEntry[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? (JSON.parse(data) as HistoriqueEntry[]) : [];
    } catch (error) {
      console.error('Erreur de lecture de l’historique :', error);
      return [];
    }
  }

  add(entry: Omit<HistoriqueEntry, 'id' | 'date'>): void {
    const entries = this.getAll();

    const newEntry: HistoriqueEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date: new Date().toISOString(),
    };

    entries.unshift(newEntry);

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(entries));
    } catch (error) {
      console.error('Erreur d’enregistrement de l’historique :', error);
    }
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }
}
