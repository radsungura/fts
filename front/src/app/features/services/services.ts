import { Component } from '@angular/core';
import { Serv } from '../../../models/interfaces';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DetailsServ } from '../../components/details-serv/details-serv';
import { AddServ } from '../../components/add-serv/add-serv';
import { Delete } from '../../components/delete/delete';
import { ServService } from '../../services/services';

@Component({
  selector: 'app-services',
  imports: [ CommonModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSelectModule,],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
displayedColumns: string[] = ['id', 'code', 'name', 'desc', 'statut', 'actions'];
  serv: Serv[] = [];
  loading = false;
  searchText = '';
  statusFilter = 'Tous';
  filtered: Serv[] = [];
  pageSize = 5;
  pageIndex = 0;
  totalserv = 0;
  activeserv = 0;
  inactiveserv = 0;
  constructor(
    private dialog: MatDialog,
    private data: ServService,
    private snackBar: MatSnackBar,
  ) {}
  ngOnInit() {
    this.loadserv();
  }
  loadserv() {
    this.loading = true;
    this.data.getAll().subscribe({
      next: (serv) => {
        this.serv = serv;
        this.filtered = serv;
        this.totalserv = serv.length;
        this.activeserv = serv.filter((serv) => serv.status === 'Actif').length;
        this.inactiveserv = serv.filter((serv) => serv.status === 'Inactif').length;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des services :', error);
        this.loading = false;
        this.snackBar.open('Impossible de charger les services', 'Fermer', {
          duration: 4000,
        });
      },
    });
  }

  search() {
    const search = this.searchText.toLowerCase().trim();

    this.filtered = this.serv.filter((serv) => {
      const matchesSearch =
        !search ||
        serv.name.toLowerCase().includes(search) ||
        serv.desc.toLowerCase().includes(search) ||
        serv.code.toLowerCase().includes(search) ||
        serv.status.toLowerCase().includes(search);

      const matchesStatus = this.statusFilter === 'Tous' || serv.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.pageIndex = 0;
  }

  changePage(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  add() {
    const dialogRef = this.dialog.open(AddServ, {
      width: '90vw',
      maxHeight: '1000vh',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.data.create(result).subscribe({
          next: () => {
            this.loadserv();

            this.snackBar.open('service ajouté avec succès', 'Fermer', {
              duration: 3000,
            });
          },
          error: (error) => {
            this.snackBar.open('Erreur lors de l’ajout du service', 'Fermer', {
              duration: 4000,
            });
          },
        });
      }
    });
  }

  details(serv: any) {
    const dialogRef = this.dialog.open(DetailsServ, {
      width: '90vw', // ou '80vw' pour responsive
      maxHeight: '1000vh',
      data: { mode: 'details', item: serv },
    });
  }

  edit(serv: Serv) {
    const dialogRef = this.dialog.open(AddServ, {
      width: '90vw',
      maxHeight: '1000vh',
      data: {
        mode: 'edit',
        item: serv,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && serv.id) {
           this.loadserv();
      }
    });
  }

  delete(serv: Serv) {
    const dialogRef = this.dialog.open(Delete, {
      width: '500px',
      data: {
        action: 'delete',
        item: 'serv',
        data: serv,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
            this.loadserv();
      }
    });
  }
}
