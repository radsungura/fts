import { Injectable } from '@angular/core';

export type AuditAction =
  | 'Création'
  | 'Modification'
  | 'Suppression'
  | 'Emprunt'
  | 'Retour'
  | 'Archivage'
  | 'Connexion'
  | 'Inventaire';

export type AuditResult = 'Réussi' | 'Échec' | 'À vérifier';

export interface AuditEntry {
  id: string;
  date: string;
  user: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  description: string;
  result: AuditResult;
  source: 'demo' | 'application';
}

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private readonly storageKey = 'fts_audit_logs_v1';

  private readonly demoEntries: AuditEntry[] = [
    {
      id: 'AUD-001',
      date: '2026-10-22T08:30:00',
      user: 'Administrateur',
      action: 'Création',
      entity: 'Document',
      entityId: 'DOC-001',
      description: 'Création du document Contrat X',
      result: 'Réussi',
      source: 'demo',
    },
    {
      id: 'AUD-002',
      date: '2026-10-22T08:15:00',
      user: 'Archiviste',
      action: 'Emprunt',
      entity: 'Document',
      entityId: 'DOC-002',
      description: 'Emprunt d’un document physique',
      result: 'Réussi',
      source: 'demo',
    },
    {
      id: 'AUD-003',
      date: '2026-10-21T15:20:00',
      user: 'Archiviste',
      action: 'Retour',
      entity: 'Emprunt',
      entityId: 'EMP-003',
      description: 'Retour enregistré pour un document',
      result: 'Réussi',
      source: 'demo',
    },
    {
      id: 'AUD-004',
      date: '2026-10-21T11:10:00',
      user: 'Administrateur',
      action: 'Modification',
      entity: 'Utilisateur',
      entityId: 'USR-002',
      description: 'Modification des informations utilisateur',
      result: 'À vérifier',
      source: 'demo',
    },
    {
      id: 'AUD-005',
      date: '2026-10-20T09:45:00',
      user: 'Archiviste',
      action: 'Archivage',
      entity: 'Document',
      entityId: 'DOC-005',
      description: 'Archivage d’un document physique',
      result: 'Réussi',
      source: 'demo',
    },
    {
      id: 'AUD-006',
      date: '2026-10-19T14:05:00',
      user: 'Utilisateur inconnu',
      action: 'Connexion',
      entity: 'Session',
      entityId: 'SESSION-006',
      description: 'Événement de connexion fictif à examiner',
      result: 'Échec',
      source: 'demo',
    },
    {
      id: 'AUD-007',
      date: '2026-10-18T10:00:00',
      user: 'Archiviste',
      action: 'Inventaire',
      entity: 'Document',
      entityId: 'DOC-007',
      description: 'Contrôle physique à confirmer',
      result: 'À vérifier',
      source: 'demo',
    },
  ];

  getEntries(): AuditEntry[] {
    const stored = this.readStorage();

    if (stored === null) {
      const initial = [...this.demoEntries];
      this.writeStorage(initial);
      return initial;
    }

    return stored;
  }

  addEntry(
    entry: Omit<AuditEntry, 'id' | 'date' | 'source'>,
    source: 'demo' | 'application' = 'application',
  ): AuditEntry {
    const entries = this.getEntries();

    const newEntry: AuditEntry = {
      ...entry,
      id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: new Date().toISOString(),
      source,
    };

    this.writeStorage([newEntry, ...entries]);

    return newEntry;
  }

  clearDemoEntries(): void {
    const remaining = this.getEntries().filter((entry) => entry.source !== 'demo');

    this.writeStorage(remaining);
  }

  resetDemoData(): void {
    this.writeStorage([...this.demoEntries]);
  }

  private readStorage(): AuditEntry[] | null {
    try {
      const raw = localStorage.getItem(this.storageKey);

      if (raw === null) {
        return null;
      }

      const parsed: unknown = JSON.parse(raw);

      if (
        !Array.isArray(parsed) ||
        !parsed.every(
          (item) =>
            item &&
            typeof item.id === 'string' &&
            typeof item.date === 'string' &&
            typeof item.user === 'string' &&
            typeof item.action === 'string',
        )
      ) {
        return null;
      }

      return parsed as AuditEntry[];
    } catch {
      return null;
    }
  }

  private writeStorage(entries: AuditEntry[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(entries));
    } catch (error) {
      console.error('Impossible de sauvegarder le journal Audit.', error);
    }
  }
}
