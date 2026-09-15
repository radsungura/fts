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
import type { Location } from '../../../models/interfaces';

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
 parent!: Location;
filteredLocations: Location[] = [];
  view: 'list' | 'grid' = 'list';
  displayedColumns: string[] = ['id', 'name', 'category', 'address', 'status', 'actions'];
  searchText = '';
  statusFilter = 'Tous';
  pageSize = 5;
  pageIndex = 0;
  action: string = '';

  constructor(private dialog: MatDialog, private data: Repo, private snackBar: MatSnackBar) {
    console.log("parent", this.parent);
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
        Location.category?.toString().includes(search) ||
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

  display(item: Location, action?: string) {
    console.log("child", item);
    
    if (action === 'back' && item.category > 1) {
      this.filteredLocations = this.repos.filter((loc) => loc.id === item.parent_id && loc.category === item.category - 1 );
      console.log("parent", this.parent);
    }else {
      this.parent = item;
      const childLocations = this.repos.filter((loc) => loc.parent_id === item.id && loc.parent_id !== 0);
      this.filteredLocations = childLocations.length > 0 ? childLocations : [item];
    }
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

  details(loc: Location) {
    this.dialog.open(Details, {
      width: '90vw',
      maxHeight: '1000vh',
      data: {
        action: 'details',
        item: loc,
      },
    });
  }

  edit(loc: Location) {
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

  delete(loc: Location) {
    const dialogRef = this.dialog.open(Delete, {
      width: '500px',
      data: {
        action: 'delete',
        data: loc,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadLocations();
      }
    });
  }

}
