import { Component } from '@angular/core';
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
import { DetailsCat } from '../../components/details-cat/details-cat';
import { AddCat } from '../../components/add-cat/add-cat';
import { Delete } from '../../components/delete/delete';
import { Cat } from '../../../models/interfaces';
import { CatService } from '../../services/categories';

@Component({
  selector: 'app-categories',
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
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
displayedColumns: string[] = ['id', 'code', 'name', 'desc', 'statut', 'actions'];
  cats: Cat[] = [];
  loading = false;
  searchText = '';
  statusFilter = 'Tous';
  filteredcats: Cat[] = [];
  pageSize = 5;
  pageIndex = 0;
  totalcats = 0;
  activecats = 0;
  inactivecats = 0;
  constructor(
    private dialog: MatDialog,
    private data: CatService,
    private snackBar: MatSnackBar,
  ) {}
  ngOnInit() {
    this.loadCat();
  }
  loadCat() {
    this.loading = true;
    this.data.getAll().subscribe({
      next: (cats) => {
        // console.log("cat", cats)
        this.cats = cats;
        this.filteredcats = cats;
        this.totalcats = cats.length;
        this.activecats = cats.filter((Cat) => Cat.status === 'Actif').length;
        this.inactivecats = cats.filter((Cat) => Cat.status === 'Inactif').length;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des catégorie :', error);
        this.loading = false;
        this.snackBar.open('Impossible de charger les catégorie', 'Fermer', {
          duration: 4000,
        });
      },
    });
  }

  searchcats() {
    const search = this.searchText.toLowerCase().trim();

    this.filteredcats = this.cats.filter((Cat) => {
      const matchesSearch =
        !search ||
        Cat.name.toLowerCase().includes(search) ||
        Cat.desc.toLowerCase().includes(search) ||
        Cat.code.toLowerCase().includes(search) ||
        Cat.status.toLowerCase().includes(search);

      const matchesStatus = this.statusFilter === 'Tous' || Cat.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.pageIndex = 0;
  }

  changePage(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  add() {
    const dialogRef = this.dialog.open(AddCat, {
      width: '90vw',
      maxHeight: '1000vh',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.data.create(result).subscribe({
          next: () => {
            this.loadCat();

            this.snackBar.open('Catégorie ajouté avec succès', 'Fermer', {
              duration: 3000,
            });
          },
          error: (error) => {
            this.snackBar.open('Erreur lors de l’ajout du catégorie', 'Fermer', {
              duration: 4000,
            });
          },
        });
      }
    });
  }

  details(Cat: any) {
    const dialogRef = this.dialog.open(DetailsCat, {
      width: '90vw', // ou '80vw' pour responsive
      maxHeight: '1000vh',
      data: { mode: 'details', item: Cat },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.catsService.addCat(result).subscribe(() => this.loadcats());
      }
    });
  }

  edit(Cat: Cat) {
    const dialogRef = this.dialog.open(AddCat, {
      width: '90vw',
      maxHeight: '1000vh',
      data: {
        mode: 'edit',
        item: Cat,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && Cat.id) {
        this.loadCat();
      }
    });
  }

  delete(Cat: Cat) {
    const dialogRef = this.dialog.open(Delete, {
      width: '500px',
      data: {
        action: 'delete',
        item: 'cat',
        data: Cat,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
            this.loadCat();
      }
    });
  }
}

