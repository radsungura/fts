import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-user',
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './add-user.html',
  styleUrl: './add-user.scss',
})
export class AddUser {
  form;

  // Rôles disponibles
  roles = ['Administrateur', 'Utilisateur', 'Gestionnaire', 'Archiviste'];

  // Statuts disponibles
  statuses = ['Actif', 'Desactivé'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUser>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    const user = data?.item;

    this.form = this.fb.group({
      name: [user?.name ?? '', Validators.required],

      email: [user?.email ?? '', [Validators.required, Validators.email]],

      role: [user?.role ?? '', Validators.required],

      status: [user?.status ?? 'Actif', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
