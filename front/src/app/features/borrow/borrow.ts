import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Delete } from '../../components/delete/delete';
import { DetailsBorrow } from '../../components/details-borrow/details-borrow';
import { AddBorrow } from '../../components/add-borrow/add-borrow';

import { Borrows } from '../../services/borrow';
import { Mov } from '../../../models/interfaces';

@Component({
  selector: 'app-borrow',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],

  templateUrl: './borrow.html',
  styleUrl: './borrow.scss',
})
export class Borrow {
  displayedColumns: string[] = [
    'id',
    'document',
    'borrower',
    'borrowDate',
    'returnDate',
    'status',
    'actions',
  ];

  mov: Mov[] = [];

  filteredMov: Mov[] = [];

  paginatedMov: Mov[] = [];

  loading = false;

  searchText = '';

  statusFilter = 'Tous';

  pageSize = 5;

  pageIndex = 0;

  constructor(
    private dialog: MatDialog,
    private data: Borrows,
  ) {}

  ngOnInit(): void {
    this.loadMov();
  }

  /*
   * Charger les emprunts
   */
  loadMov(): void {
    this.loading = true;

    this.data.getAll().subscribe({
      next: (movs) => {
        /*
         * Détection automatique des retards
         */
        this.updateOverdueStatuses(movs);

        this.mov = movs;

        this.filteredMov = [...movs];

        this.pageIndex = 0;

        this.updatePagination();

        this.loading = false;
      },

      error: (error) => {
        console.error('Erreur lors du chargement des emprunts :', error);

        this.loading = false;
      },
    });
  }

  /*
   * Détecter automatiquement les emprunts en retard
   */
  updateOverdueStatuses(movs: Mov[]): void {
    const today = this.getToday();

    movs.forEach((mov) => {
      /*
       * Un emprunt retourné ne doit jamais
       * être considéré comme en retard.
       */
      if (mov.status === 'Retourné') {
        return;
      }

      /*
       * Si la date de retour est dépassée,
       * l'emprunt devient automatiquement
       * "En retard".
       */
      if (mov.returnDate < today) {
        mov.status = 'En retard';
      } else {
        /*
         * Si la date n'est pas dépassée,
         * l'emprunt reste "Emprunté".
         */
        mov.status = 'Emprunté';
      }
    });
  }

  /*
   * Retourne la date actuelle au format :
   * YYYY-MM-DD
   */
  getToday(): string {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, '0');

    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /*
   * Rechercher / filtrer les emprunts
   */
  searchMovements(): void {
    const search = this.searchText.toLowerCase().trim();

    this.filteredMov = this.mov.filter((mov) => {
      const matchesSearch =
        !search ||
        mov.documentTitle.toLowerCase().includes(search) ||
        mov.borrower.toLowerCase().includes(search);

      const matchesStatus = this.statusFilter === 'Tous' || mov.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.pageIndex = 0;

    this.updatePagination();
  }

  /*
   * Pagination
   */
  changePage(event: any): void {
    this.pageIndex = event.pageIndex;

    this.pageSize = event.pageSize;

    this.updatePagination();
  }

  updatePagination(): void {
    const start = this.pageIndex * this.pageSize;

    const end = start + this.pageSize;

    this.paginatedMov = this.filteredMov.slice(start, end);
  }

  /*
   * Classe CSS selon le statut
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'Emprunté':
        return 'status-borrowed';

      case 'En retard':
        return 'status-late';

      case 'Retourné':
        return 'status-returned';

      default:
        return '';
    }
  }

  /*
   * Ajouter un emprunt
   */
  addMov(): void {
    const dialogRef = this.dialog.open(AddBorrow, {
      width: '90vw',

      maxWidth: '650px',

      maxHeight: '90vh',

      data: {
        action: 'add',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadMov();
      }
    });
  }

  /*
   * Afficher les détails
   */
  details(mov: Mov): void {
    this.dialog.open(DetailsBorrow, {
      width: '90vw',

      maxWidth: '700px',

      data: {
        mode: 'details',

        item: mov,
      },
    });
  }

  /*
   * Modifier un emprunt
   */
  edit(mov: Mov): void {
    const dialogRef = this.dialog.open(AddBorrow, {
      width: '90vw',

      maxWidth: '650px',

      maxHeight: '90vh',

      data: {
        action: 'edit',

        data: mov,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadMov();
      }
    });
  }

  /*
   * Supprimer un emprunt
   */
  delete(mov: Mov): void {
    const dialogRef = this.dialog.open(Delete, {
      width: '90vw',

      maxWidth: '450px',

      data: {
        mode: 'borrow',

        item: mov,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        if (!mov.id) {
          return;
        }

        this.data.delete(mov.id).subscribe({
          next: () => {
            this.loadMov();
          },

          error: (error) => {
            console.error('Erreur lors de la suppression :', error);
          },
        });
      }
    });
  }
}
