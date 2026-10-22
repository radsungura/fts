import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuditAction, AuditEntry, AuditResult, AuditService } from '../../services/audit.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './audit.html',
  styleUrl: './audit.scss',
})
export class AuditComponent implements OnInit {
  private readonly auditService = inject(AuditService);

  entries: AuditEntry[] = [];
  searchTerm = '';
  actionFilter = '';
  resultFilter = '';
  startDate = '';
  endDate = '';

  currentPage = 1;
  pageSize = 10;

  readonly actions: AuditAction[] = [
    'Création',
    'Modification',
    'Suppression',
    'Emprunt',
    'Retour',
    'Archivage',
    'Connexion',
    'Inventaire',
  ];

  readonly results: AuditResult[] = ['Réussi', 'Échec', 'À vérifier'];

  ngOnInit(): void {
    this.loadEntries();
  }

  loadEntries(): void {
    this.entries = this.auditService
      .getEntries()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    this.currentPage = 1;
  }

  get filteredEntries(): AuditEntry[] {
    const term = this.searchTerm.trim().toLocaleLowerCase();

    return this.entries.filter((entry) => {
      const searchable = [
        entry.id,
        entry.user,
        entry.action,
        entry.entity,
        entry.entityId,
        entry.description,
        entry.result,
      ]
        .join(' ')
        .toLocaleLowerCase();

      const matchesSearch = !term || searchable.includes(term);

      const matchesAction = !this.actionFilter || entry.action === this.actionFilter;

      const matchesResult = !this.resultFilter || entry.result === this.resultFilter;

      const entryDate = entry.date.slice(0, 10);

      const matchesStart = !this.startDate || entryDate >= this.startDate;

      const matchesEnd = !this.endDate || entryDate <= this.endDate;

      return matchesSearch && matchesAction && matchesResult && matchesStart && matchesEnd;
    });
  }

  get paginatedEntries(): AuditEntry[] {
    const start = (this.currentPage - 1) * this.pageSize;

    return this.filteredEntries.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredEntries.length / this.pageSize));
  }

  get firstItem(): number {
    return this.filteredEntries.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get lastItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredEntries.length);
  }

  get totalCount(): number {
    return this.entries.length;
  }

  get successCount(): number {
    return this.entries.filter((entry) => entry.result === 'Réussi').length;
  }

  get failureCount(): number {
    return this.entries.filter((entry) => entry.result === 'Échec').length;
  }

  get reviewCount(): number {
    return this.entries.filter((entry) => entry.result === 'À vérifier').length;
  }

  get demoCount(): number {
    return this.entries.filter((entry) => entry.source === 'demo').length;
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onFilterChange(): void {
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.actionFilter = '';
    this.resultFilter = '';
    this.startDate = '';
    this.endDate = '';
    this.currentPage = 1;
  }

  printReport(): void {
    window.print();
  }

  exportCsv(): void {
    const headers = [
      'Identifiant',
      'Date',
      'Utilisateur',
      'Action',
      'Type objet',
      'Référence objet',
      'Description',
      'Résultat',
      'Source',
    ];

    const rows = this.filteredEntries.map((entry) => [
      entry.id,
      entry.date,
      entry.user,
      entry.action,
      entry.entity,
      entry.entityId,
      entry.description,
      entry.result,
      entry.source === 'demo' ? 'Démonstration' : 'Application',
    ]);

    const escapeCsv = (value: string): string => `"${value.replace(/"/g, '""')}"`;

    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(';')).join('\r\n');

    // BOM pour une meilleure compatibilité avec Excel.
    const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `rapport-audit-${new Date().toISOString().slice(0, 10)}.csv`;

    link.click();
    URL.revokeObjectURL(url);
  }

  clearDemoData(): void {
    const confirmed = window.confirm('Supprimer les données de démonstration du journal Audit ?');

    if (!confirmed) {
      return;
    }

    this.auditService.clearDemoEntries();
    this.loadEntries();
  }

  restoreDemoData(): void {
    const confirmed = window.confirm(
      'Réinitialiser le journal avec les exemples de démonstration ? ' +
        'Les événements locaux actuels seront remplacés.',
    );

    if (!confirmed) {
      return;
    }

    this.auditService.resetDemoData();
    this.loadEntries();
  }

  resultClass(result: AuditResult): string {
    switch (result) {
      case 'Réussi':
        return 'status-success';
      case 'Échec':
        return 'status-failure';
      default:
        return 'status-review';
    }
  }

  actionClass(action: AuditAction): string {
    return (
      'action-' +
      action
        .toLocaleLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
    );
  }

  trackById(_index: number, entry: AuditEntry): string {
    return entry.id;
  }
}
