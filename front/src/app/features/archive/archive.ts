import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DetailsDoc } from '../../components/details-doc/details-doc';
import { AddDoc } from '../../components/add-doc/add-doc';
import { Delete } from '../../components/delete/delete';
import { Doc } from '../../../models/interfaces';
import { Document } from '../../../app/services/document';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-archive',
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
  templateUrl: './archive.html',
  styleUrl: './archive.scss',
})
export class Archive {
  documents: Doc[] = [];
  displayedColumns: string[] = ['id', 'title', 'category', 'location', 'status', 'actions'];
  filteredDocuments: Doc[] = [];
  loading = false;

  searchText = '';
  statusFilter = 'Tous';

  pageSize = 5;
  pageIndex = 0;
  constructor(
    private dialog: MatDialog,
    private data: Document,
  ) {}
  ngOnInit() {
    this.loadDocs();
  }
  loadDocs() {
    this.loading = true;

    this.data.getAll().subscribe({
      next: (docs) => {
        this.documents = docs;
        this.filteredDocuments = [...docs];

        this.loading = false;
      },

      error: (error) => {
        console.error('Erreur lors du chargement des documents :', error);

        this.loading = false;
      },
    });
  }
  changePage(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  searchDocuments() {
    const search = this.searchText.toLowerCase().trim();

    this.filteredDocuments = this.documents.filter((doc) => {
      const matchesSearch =
        !search ||
        doc.title.toLowerCase().includes(search) ||
        doc.category.toLowerCase().includes(search) ||
        doc.location.toLowerCase().includes(search) ||
        doc.status.toLowerCase().includes(search);

      const matchesStatus = this.statusFilter === 'Tous' || doc.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.pageIndex = 0;
  }

  addDoc() {
    const dialogRef = this.dialog.open(AddDoc, {
      width: '90vw', // ou '80vw' pour responsive
      maxHeight: '1000vh',

      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.documentsService.addDocument(result).subscribe(() => this.loadDocuments());
      }
    });
  }

  details(doc: any) {
    console.log('📄 Détails du document :', doc);
    // Naviguer vers une page ou ouvrir une modale
    const dialogRef = this.dialog.open(DetailsDoc, {
      width: '90vw', // ou '80vw' pour responsive
      maxHeight: '1000vh',
      data: { mode: 'details', item: doc },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.documentsService.addDocument(result).subscribe(() => this.loadDocuments());
      }
    });
  }

  edit(doc: any) {
    console.log('✏️ Modifier le document :', doc);
    // Naviguer vers un formulaire ou afficher une modale
    const dialogRef = this.dialog.open(AddDoc, {
      width: '90vw', // ou '80vw' pour responsive
      maxHeight: '1000vh',
      data: { mode: 'edit' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.documentsService.addDocument(result).subscribe(() => this.loadDocuments());
      }
    });
  }

  delete(doc: any) {
    console.log('🗑️ Supprimer le document :', doc);
    // Confirmer et supprimer via API ou service
    const dialogRef = this.dialog.open(Delete, {
      width: '90vw', // ou '80vw' pour responsive
      maxHeight: '1000vh',
      data: { mode: 'document' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.documentsService.addDocument(result).subscribe(() => this.loadDocuments());
      }
    });
  }
}
