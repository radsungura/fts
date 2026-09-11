import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Repo } from '../../services/repo';
import { Add } from '../../components/repo/add/add';
import { Details } from '../../components/repo/details/details';
import { Delete } from '../../components/delete/delete';
import { Location } from '../../../models/interfaces';

@Component({
  selector: 'app-repos',
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
    MatSnackBarModule,
  ],
  templateUrl: './repos.html',
  styleUrl: './repos.scss',
})
export class Repos {
 repos: Location[] = [];
filteredLocations: Location[] = [];

  view: 'list' | 'grid' = 'list';

  displayedColumns: string[] = ['id', 'name', 'category', 'address', 'status', 'actions'];

  searchText = '';
  statusFilter = 'Tous';

  pageSize = 5;
  pageIndex = 0;

  constructor(
    private dialog: MatDialog,
    private data: Repo,
    private snackBar: MatSnackBar,
  ) {

  }

  ngOnInit() {
    this.loadLocations();
  }

  loadLocations() {
    this.data.getAll().subscribe({
      next: (Locations) => {
        this.repos = [...Locations].reverse();
        this.filteredLocations = [...this.repos];
        this.searchLocations();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des dépots :', error);

        this.snackBar.open('Impossible de charger les dépots', 'Fermer', { duration: 4000 });
      },
    });
  }

  searchLocations() {
    const search = this.searchText.toLowerCase().trim();

    this.filteredLocations = this.repos.filter((Location) => {
      const matchesSearch =
        !search ||
        Location.name?.toLowerCase().includes(search) ||
        Location.category?.toLowerCase().includes(search) ||
        Location.address?.toLowerCase().includes(search) ||
        Location.status?.toLowerCase().includes(search);

      const matchesStatus = this.statusFilter === 'Tous' || Location.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.pageIndex = 0;
  }

  changePage(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  toggleView() {
    this.view = this.view === 'list' ? 'grid' : 'list';
  }

  add() {
    const dialogRef = this.dialog.open(Add, {
      width: '90vw',
      maxHeight: '1000vh',
      data: {
        action: 'add',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadLocations();
      }
    });
  }

  details(Location: Location) {
    this.dialog.open(Details, {
      width: '90vw',
      maxHeight: '1000vh',
      data: {
        action: 'details',
        item: Location,
      },
    });
  }

  edit(Location: Location) {
    const dialogRef = this.dialog.open(Add, {
      width: '90vw',
      maxHeight: '1000vh',
      data: {
        action: 'edit',
        data: Location,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadLocations();
      }
    });
  }

  delete(Location: Location) {
    const dialogRef = this.dialog.open(Delete, {
      width: '500px',
      data: {
        action: 'delete',
        data: Location,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadLocations();
      }
    });
  }

}
