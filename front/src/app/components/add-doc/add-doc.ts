import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { Doc } from '../../../models/interfaces';
import { Document } from '../../services/document';

@Component({
  selector: 'app-add-doc',
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
  templateUrl: './add-doc.html',
  styleUrl: './add-doc.scss',
})
export class AddDoc {
  servererror = false;

  form;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddDoc>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serv: Document,
  ) {
    const doc = data?.data;

    this.form = this.fb.group({
      title: [doc?.title ?? '', Validators.required],

      reference: [doc?.reference ?? '', Validators.required],

      category: [doc?.category ?? '', Validators.required],

      location: [doc?.location ?? '', Validators.required],

      status: [doc?.status ?? 'Actif', Validators.required],
    });
  }

  onSubmit(): void {
    this.servererror = false;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const documentData = this.form.getRawValue() as Doc;

    if (this.data.action === 'add') {
      this.add(documentData);
    } else {
      this.edit(documentData);
    }
  }

  add(doc: Doc): void {
    this.serv.create(doc).subscribe({
      next: (result: Doc) => {
        this.dialogRef.close(result);
      },

      error: (error) => {
        console.error('Erreur lors de l’ajout du document :', error);

        this.servererror = true;
      },
    });
  }

  edit(doc: Doc): void {
    const id = this.data?.data?.id;

    if (!id) {
      console.error('ID du document manquant');
      this.servererror = true;
      return;
    }

    this.serv.update(id, doc).subscribe({
      next: (result: Doc) => {
        this.dialogRef.close(result);
      },

      error: (error) => {
        console.error('Erreur lors de la modification du document :', error);

        this.servererror = true;
      },
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
