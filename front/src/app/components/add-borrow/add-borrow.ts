import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { Mov, Doc } from '../../../models/interfaces';
import { Borrows } from '../../services/borrow';
import { Document } from '../../../app/services/document';

@Component({
  selector: 'app-add-borrow',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],

  templateUrl: './add-borrow.html',
  styleUrl: './add-borrow.scss',
})
export class AddBorrow implements OnInit {
  servererror = false;

  documents: Doc[] = [];

  private fb = inject(FormBuilder);

  form = this.fb.group({
    documentId: [null as number | null, Validators.required],

    documentTitle: ['', Validators.required],

    borrower: ['', Validators.required],

    borrowDate: ['', Validators.required],

    returnDate: ['', Validators.required],

    status: ['Emprunté', Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<AddBorrow>,

    @Inject(MAT_DIALOG_DATA)
    public data: any,

    private serv: Borrows,

    private documentService: Document,
  ) {}

  ngOnInit(): void {
    this.loadDocuments();

    /*
     * Mode modification
     */
    if (this.data?.action === 'edit' && this.data?.data) {
      this.form.patchValue({
        documentId: this.data.data.documentId ?? null,
        documentTitle: this.data.data.documentTitle ?? '',
        borrower: this.data.data.borrower ?? '',
        borrowDate: this.data.data.borrowDate ?? '',
        returnDate: this.data.data.returnDate ?? '',
        status: this.data.data.status ?? 'Emprunté',
      });
    }
  }

  /*
   * Charger les documents
   */
  loadDocuments(): void {
    this.documentService.getAll().subscribe({
      next: (docs) => {
        this.documents = docs;
      },

      error: (error) => {
        console.error('Erreur lors du chargement des documents :', error);
      },
    });
  }

  /*
   * Sélection d'un document
   */
  onDocumentChange(documentId: number): void {
    const selectedDocument = this.documents.find((doc) => doc.id === documentId);

    if (selectedDocument) {
      this.form.patchValue({
        documentTitle: selectedDocument.title,
      });
    }
  }

  /*
   * Ajouter un emprunt
   */

  add(): void {
    this.servererror = false;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const item = this.form.getRawValue() as Mov;

    // Vérifier que le document a bien été sélectionné
    if (!item.documentId) {
      this.servererror = true;
      return;
    }

    // Rechercher le document sélectionné
    const selectedDocument = this.documents.find((doc) => doc.id === item.documentId);

    if (!selectedDocument) {
      console.error('Document introuvable');
      this.servererror = true;
      return;
    }

    // Vérifier que le document n'est pas déjà emprunté
    if (selectedDocument.status === 'Emprunté') {
      console.error('Ce document est déjà emprunté');
      this.servererror = true;
      return;
    }

    // 1. Mettre le document à l'état "Emprunté"
    const updatedDocument: Doc = {
      ...selectedDocument,
      status: 'Emprunté',
    };

    this.documentService.update(selectedDocument.id!, updatedDocument).subscribe({
      next: () => {
        // 2. Enregistrer l'emprunt
        this.serv.create(item).subscribe({
          next: (result: Mov) => {
            this.dialogRef.close(result);
          },

          error: (error) => {
            console.error('Erreur lors de la création de l’emprunt :', error);

            // Si la création de l'emprunt échoue,
            // on remet le document à son état précédent.
            this.documentService.update(selectedDocument.id!, selectedDocument).subscribe({
              next: () => {
                console.log('Le document a été remis à son état initial.');
              },
              error: (restoreError) => {
                console.error('Erreur lors de la restauration du document :', restoreError);
              },
            });

            this.servererror = true;
          },
        });
      },

      error: (error) => {
        console.error('Erreur lors de la mise à jour du document :', error);

        this.servererror = true;
      },
    });
  }

  /*
   * Modifier un emprunt
   */
  edit(): void {
    this.servererror = false;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.data?.data?.id;

    if (!id) {
      console.error('ID du mouvement manquant');
      this.servererror = true;
      return;
    }

    const item = this.form.getRawValue() as Mov;

    this.serv.update(id, item).subscribe({
      next: (result: Mov) => {
        this.dialogRef.close(result);
      },

      error: (error) => {
        console.error('Erreur lors de la modification de l’emprunt :', error);

        this.servererror = true;
      },
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
