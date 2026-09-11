import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { DetailsDoc } from '../../components/details-doc/details-doc';
import { AddDoc } from '../../components/add-doc/add-doc';
import { Delete } from '../../components/delete/delete';

import { Document } from '../../services/document';
import { Doc } from '../../../models/interfaces';

@Component({
  selector: 'app-documents',
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
  templateUrl: './documents.html',
  styleUrl: './documents.scss',
})
export class Documents {
  documents: Doc[] = [];
  filteredDocuments: Doc[] = [];

  view: 'list' | 'grid' = 'list';

  displayedColumns: string[] = ['id', 'title', 'category', 'location', 'status', 'actions'];

  searchText = '';
  statusFilter = 'Tous';

  pageSize = 5;
  pageIndex = 0;

  constructor(
    private dialog: MatDialog,
    private data: Document,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadDocs();
  }

  loadDocs() {
    this.data.getAll().subscribe({
      next: (docs) => {
        this.documents = [...docs].reverse();
        this.filteredDocuments = [...this.documents];
        this.searchDocuments();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des documents :', error);

        this.snackBar.open('Impossible de charger les documents', 'Fermer', { duration: 4000 });
      },
    });
  }

  searchDocuments() {
    const search = this.searchText.toLowerCase().trim();

    this.filteredDocuments = this.documents.filter((doc) => {
      const matchesSearch =
        !search ||
        doc.title?.toLowerCase().includes(search) ||
        doc.category?.toLowerCase().includes(search) ||
        doc.location?.toLowerCase().includes(search) ||
        doc.status?.toLowerCase().includes(search);

      const matchesStatus = this.statusFilter === 'Tous' || doc.status === this.statusFilter;

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
    const dialogRef = this.dialog.open(AddDoc, {
      width: '90vw',
      maxHeight: '1000vh',
      data: {
        action: 'add',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadDocs();
      }
    });
  }

  details(doc: Doc) {
    this.dialog.open(DetailsDoc, {
      width: '90vw',
      maxHeight: '1000vh',
      data: {
        action: 'details',
        item: doc,
      },
    });
  }

  edit(doc: Doc) {
    const dialogRef = this.dialog.open(AddDoc, {
      width: '90vw',
      maxHeight: '1000vh',
      data: {
        action: 'edit',
        data: doc,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadDocs();
      }
    });
  }

  delete(doc: Doc) {
    const dialogRef = this.dialog.open(Delete, {
      width: '500px',
      data: {
        action: 'delete',
        data: doc,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadDocs();
      }
    });
  }
}
