import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  HistoriqueAction,
  HistoriqueEntry,
  HistoriqueService,
} from '../../services/historique.service';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTooltipModule,
  ],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class Historique implements OnInit {
  entries: HistoriqueEntry[] = [];
  filteredEntries: HistoriqueEntry[] = [];
  paginatedEntries: HistoriqueEntry[] = [];

  searchText = '';
  actionFilter = 'Toutes';
  dateFrom = '';
  dateTo = '';

  pageIndex = 0;
  pageSize = 10;

  readonly actions: HistoriqueAction[] = [
    'Création',
    'Modification',
    'Suppression',
    'Emprunt',
    'Retour',
    'Archivage',
  ];

  constructor(private historiqueService: HistoriqueService) {}

  ngOnInit(): void {
    this.load();
  }

  get totalEmprunts(): number {
    return this.entries.filter((e) => e.action === 'Emprunt').length;
  }

  get totalRetours(): number {
    return this.entries.filter((e) => e.action === 'Retour').length;
  }

  load(): void {
    this.entries = this.historiqueService.getAll();
    this.filter();
  }

  filter(): void {
    const query = this.searchText.trim().toLowerCase();

    this.filteredEntries = this.entries.filter((entry) => {
      const searchable = [
        entry.document,
        entry.reference ?? '',
        entry.utilisateur,
        entry.details,
        entry.action,
      ]
        .join(' ')
        .toLowerCase();

      const entryDate = entry.date.slice(0, 10);

      return (
        (!query || searchable.includes(query)) &&
        (this.actionFilter === 'Toutes' || entry.action === this.actionFilter) &&
        (!this.dateFrom || entryDate >= this.dateFrom) &&
        (!this.dateTo || entryDate <= this.dateTo)
      );
    });

    this.pageIndex = 0;
    this.updatePage();
  }

  changePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePage();
  }

  updatePage(): void {
    const start = this.pageIndex * this.pageSize;
    this.paginatedEntries = this.filteredEntries.slice(start, start + this.pageSize);
  }

  actionClass(action: string): string {
    return (
      'action-' +
      action
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
    );
  }

  exportCsv(): void {
    const headers = ['Date', 'Action', 'Document', 'Référence', 'Utilisateur', 'Détails'];

    const escapeCsv = (value: string): string => `"${String(value ?? '').replace(/"/g, '""')}"`;

    const rows = this.filteredEntries.map((entry) => [
      new Date(entry.date).toLocaleString('fr-FR'),
      entry.action,
      entry.document,
      entry.reference ?? '',
      entry.utilisateur,
      entry.details,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => escapeCsv(String(value))).join(';'))
      .join('\r\n');

    // BOM pour améliorer l'ouverture du CSV dans Excel.
    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'historique-fts.csv';
    link.click();

    URL.revokeObjectURL(url);
  }

  print(): void {
    window.print();
  }
}
