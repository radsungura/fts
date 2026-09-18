import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

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

  hidePassword = true;
  hideConfirmPassword = true;

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
    const isAddMode = data?.mode === 'add';

    const passwordValidators = [
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
    ];

    if (isAddMode) {
      passwordValidators.unshift(Validators.required);
    }

    this.form = this.fb.group(
      {
        name: [user?.name ?? '', Validators.required],

        email: [user?.email ?? '', [Validators.required, Validators.email]],

        role: [user?.role ?? '', Validators.required],

        status: [user?.status ?? 'Actif', Validators.required],

        password: ['', passwordValidators],

        confirmPassword: ['', isAddMode ? Validators.required : []],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  /**
   * Vérifie que les deux mots de passe correspondent.
   */
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    // En modification, les deux champs peuvent rester vides.
    if (!password && !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  /**
   * Vérifie si le mot de passe est suffisamment fort.
   */
  getPasswordStrength(): string {
    const password = this.form.get('password')?.value ?? '';

    if (!password) {
      return '';
    }

    let score = 0;

    if (password.length >= 8) {
      score++;
    }

    if (/[a-z]/.test(password)) {
      score++;
    }

    if (/[A-Z]/.test(password)) {
      score++;
    }

    if (/\d/.test(password)) {
      score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score++;
    }

    if (score <= 2) {
      return 'Faible';
    }

    if (score <= 4) {
      return 'Moyen';
    }

    return 'Fort';
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;

      // En modification, ne pas envoyer un mot de passe vide.
      if (this.data?.mode !== 'add' && !formValue.password) {
        delete formValue.password;
        delete formValue.confirmPassword;
      }

      // La confirmation ne doit jamais être envoyée au backend.
      delete formValue.confirmPassword;

      this.dialogRef.close(formValue);
    }
  }
}
