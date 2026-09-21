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
import { Document } from '../../../app/services/document';

import { Mov, Doc } from '../../../models/interfaces';

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
    private documentService: Document,
  ) {}

  ngOnInit(): void {
    this.loadMov();
  }

  /**
   * Charger tous les emprunts
   */
  loadMov(): void {
    this.loading = true;

    this.data.getAll().subscribe({
      next: (movs) => {
        // Mettre automatiquement les emprunts dépassés
        // à l'état "En retard" pour l'affichage
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

  /**
   * Mettre automatiquement le statut à "En retard"
   * lorsque la date de retour prévue est dépassée.
   *
   * Attention :
   * cette modification est uniquement pour l'affichage.
   * Elle n'est pas enregistrée dans le backend.
   */
  updateOverdueStatuses(movs: Mov[]): void {
    const today = this.getToday();

    movs.forEach((mov) => {
      // Un document déjà retourné reste "Retourné"
      if (mov.status === 'Retourné') {
        return;
      }

      // Si la date de retour est dépassée
      if (mov.returnDate < today) {
        mov.status = 'En retard';
      } else {
        mov.status = 'Emprunté';
      }
    });
  }

  /**
   * Retourne la date actuelle au format YYYY-MM-DD
   */
  getToday(): string {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Rechercher un emprunt
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

  /**
   * Changer de page
   */
  changePage(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.updatePagination();
  }

  /**
   * Mettre à jour les éléments affichés sur la page
   */
  updatePagination(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedMov = this.filteredMov.slice(start, end);
  }

  /**
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

  /**
   * Ajouter un nouvel emprunt
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

  /**
   * Afficher les détails d'un emprunt
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

  /**
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

  /**
   * Retourner un document
   *
   * 1. On confirme le retour.
   * 2. On met l'emprunt à "Retourné".
   * 3. On remet automatiquement le document à "Actif".
   */
  returnDocument(mov: Mov): void {
    if (!mov.id) {
      console.error('ID de l’emprunt manquant');
      return;
    }

    if (!mov.documentId) {
      console.error('ID du document manquant');
      return;
    }

    const confirmed = window.confirm(`Confirmer le retour du document "${mov.documentTitle}" ?`);

    if (!confirmed) {
      return;
    }

    /*
     * Nouveau statut de l'emprunt
     */
    const returnedMov: Mov = {
      ...mov,
      status: 'Retourné',
    };

    /*
     * 1. Mettre l'emprunt à "Retourné"
     */
    this.data.update(mov.id, returnedMov).subscribe({
      next: () => {
        console.log(`L’emprunt #${mov.id} a été marqué comme retourné.`);

        /*
         * 2. Récupérer le document correspondant
         */
        this.documentService.getAll().subscribe({
          next: (documents: Doc[]) => {
            const document = documents.find((doc) => doc.id === mov.documentId);

            if (!document) {
              console.error(`Document #${mov.documentId} introuvable.`);

              // L'emprunt est quand même retourné
              this.loadMov();
              return;
            }

            /*
             * 3. Remettre le document à "Actif"
             */
            const updatedDocument: Doc = {
              ...document,
              status: 'Actif',
            };

            this.documentService.update(document.id!, updatedDocument).subscribe({
              next: () => {
                console.log(`Le document "${document.title}" est maintenant Actif.`);

                /*
                 * 4. Recharger la liste
                 */
                this.loadMov();
              },

              error: (error) => {
                console.error('Erreur lors de la mise à jour du statut du document :', error);

                /*
                 * L'emprunt est déjà retourné.
                 * On recharge malgré l'erreur.
                 */
                this.loadMov();
              },
            });
          },

          error: (error) => {
            console.error('Erreur lors du chargement des documents :', error);

            this.loadMov();
          },
        });
      },

      error: (error) => {
        console.error('Erreur lors du retour du document :', error);
      },
    });
  }

  /**
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
          console.error('ID de l’emprunt manquant');
          return;
        }

        this.data.delete(mov.id).subscribe({
          next: () => {
            console.log(`L’emprunt #${mov.id} a été supprimé.`);

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
