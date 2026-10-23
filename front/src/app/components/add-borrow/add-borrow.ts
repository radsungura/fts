import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Mov, Doc, Serv } from '../../../models/interfaces';
import { Borrows } from '../../services/borrow';
import { Document } from '../../services/document';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Functions } from '../../services/functions';
import { ServService } from '../../services/services';

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
    MatDatepickerModule,
  ],

  templateUrl: './add-borrow.html',
  styleUrl: './add-borrow.scss',
})
export class AddBorrow implements OnInit {
  borrowererror = false;
  documents: Doc[] = [];

  private fb = inject(FormBuilder);

  form = this.fb.group({
    documentId: ['', Validators.required],
    documentTitle: ['', Validators.required],
    borrower: ['', Validators.required],
    service: ['', Validators.required],
    returned_by: [''],
    bdesc: [''],
    rdesc: [''],
    borrowDate: ['', Validators.required],
    returnDate: ['', Validators.required],
    returned_at: [''],
    bcreated_by: [''],
    rcreated_by: [''],
    status: ['', Validators.required],
  });

  servs: Serv[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddBorrow>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private borrow: Borrows,
    private docService: Document,
    private func: Functions,
    private serv: ServService
  ) {
    this.serv.getAll().subscribe((el) => {
      this.servs = el;
    });
  }

  ngOnInit(): void {
    this.loadDocuments();
    if (this.data?.action === 'edit' && this.data?.data) {
      this.form.patchValue({
        documentId: this.data.data.documentId ?? null,
        documentTitle: this.data.data.documentTitle ?? '',
        borrower: this.data.data.borrower ?? '',
        service: this.data.data.service ?? '',
        bdesc: this.data.data.bdesc ?? '',
        rdesc: this.data.data.rdesc ?? '',
        borrowDate: this.data.data.borrowDate ?? '',
        returnDate: this.data.data.returnDate ?? '',
        returned_at: this.data.data.returned_at ?? '',
        bcreated_by: this.data.data.bcreated_by ?? '',
        rcreated_by: this.data.data.rcreated_by ?? '',
        status: this.data.data.status ?? 'Emprunté',
      });
    }
    else if (this.data?.action === 'return' && this.data?.data) {
      this.form.patchValue({
        documentId: this.data.data.documentId ?? null,
        documentTitle: this.data.data.documentTitle ?? '',
        borrower: this.data.data.borrower ?? '',
        service: this.data.data.service ?? '',
        bdesc: this.data.data.bdesc ?? '',
        rdesc: this.data.data.rdesc ?? '',
        borrowDate: this.data.data.borrowDate ?? '',
        returnDate: this.data.data.returnDate ?? '',
        returned_at: this.data.data.returned_at ?? '',
        returned_by: this.data.data.borrower ?? '',
        bcreated_by: this.data.data.bcreated_by ?? '',
        rcreated_by: this.data.data.rcreated_by ?? '',
        status: this.data.data.status ?? 'Emprunté',
      });
    }
  }

  /*
   * Charger les documents
   */
  loadDocuments(): void {
    this.docService.getAll().subscribe({
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
  onDocumentChange(documentId: string): void {
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
    this.borrowererror = false;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const item = this.form.getRawValue() as unknown  as Mov;

    // Vérifier que le document a bien été sélectionné
    if (!item.documentId) {
      this.borrowererror = true;
      return;
    }

    // Rechercher le document sélectionné
    const selectedDocument = this.documents.find((doc) => doc.id === item.documentId);

    if (!selectedDocument) {
      console.error('Document introuvable');
      this.borrowererror = true;
      return;
    }

    // Vérifier que le document n'est pas déjà emprunté
    if (selectedDocument.status === 'Emprunté') {
      console.error('Ce document est déjà emprunté');
      this.borrowererror = true;
      return;
    }

    // 1. Mettre le document à l'état "Emprunté"
    const updatedDocument: Doc = {
      ...selectedDocument,
      status: 'Emprunté',
    };

    this.docService.update(selectedDocument.id!, updatedDocument).subscribe({
      next: () => {
        // 2. Enregistrer l'emprunt
        this.borrow.create(item).subscribe({
          next: (result: Mov) => {
            this.dialogRef.close(result);
          },

          error: (error) => {
            console.error('Erreur lors de la création de l’emprunt :', error);

            // Si la création de l'emprunt échoue,
            // on remet le document à son état précédent.
            this.docService.update(selectedDocument.id!, selectedDocument).subscribe({
              next: () => {
                console.log('Le document a été remis à son état initial.');
              },
              error: (restoreError) => {
                console.error('Erreur lors de la restauration du document :', restoreError);
              },
            });

            this.borrowererror = true;
          },
        });
      },

      error: (error) => {
        console.error('Erreur lors de la mise à jour du document :', error);

        this.borrowererror = true;
      },
    });
  }

  // ajouter un retour du document

  return(): void {
    console.log('Editing borrow record', this.form?.value);

    this.borrowererror = false;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.data?.data?.id;

    if (!id) {
      console.error('ID du mouvement manquant');
      this.borrowererror = true;
      return;
    }

    const item = this.form.getRawValue() as unknown  as Mov;
    item.returned_at = new Date();
    item.borrowDate = new Date(this.func.dateFormate(item.borrowDate));
    item.returnDate = new Date(this.func.dateFormate(this.data?.data?.returnDate));
    item.status = 'Retourné';
    // item.rcreated_by = this.dsession.id;
    const selectedDocument = this.documents.find((doc) => doc.id === item.documentId && doc.status === 'Emprunté') || null;
    if (!selectedDocument) {
      console.error('Document emprunté introuvable');
      this.borrowererror = true;
      return;
    }

    const updatedDocument: Doc = {
      ...selectedDocument,
      status: 'Disponible',
    };

    this.docService.update(selectedDocument?.id!, updatedDocument).subscribe({
      next: (res: Doc) => {
        this.borrow.update(id, item).subscribe({
          next: (result: Mov) => {
            this.dialogRef.close(result);
          },
          error: (error) => {
            console.error('Erreur lors de la modification de l’emprunt :', error);
            this.borrowererror = true;
          },
        });
      },
      error: (error) => {
        console.error('Erreur lors de la modification ddu document :', error);
        this.borrowererror = true;
      },
    });
  }

  edit(): void {
    console.log('Editing borrow record', this.form?.value);
    this.borrowererror = false;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.data?.data?.id;

    if (!id) {
      console.error('ID du mouvement manquant');
      this.borrowererror = true;
      return;
    }

    const item = this.form.getRawValue() as unknown  as Mov;

    this.borrow.update(id, item).subscribe({
      next: (result: Mov) => {
        this.dialogRef.close(result);
      },

      error: (error) => {
        console.error('Erreur lors de la modification de l’emprunt :', error);

        this.borrowererror = true;
      },
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
