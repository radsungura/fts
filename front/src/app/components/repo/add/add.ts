import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Location } from '../../../../models/interfaces';
import { Repo } from '../../../services/repo';

@Component({
  selector: 'app-add',
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
  templateUrl: './add.html',
  styleUrl: './add.scss',
})
export class Add {
  servererror = false;
  form;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<Add>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serv: Repo,
  ) {
    const location = data?.data;

    this.form = this.fb.group({
      name: [location?.name ?? '', Validators.required],
      code: [location?.code ?? '', Validators.required],
      category: [location?.category ?? '', Validators.required],
      address: [location?.address ?? '', Validators.required],
      desc: [location?.desc ?? '', Validators.required],
      status: [location?.status ?? 'Actif', Validators.required],
      created_at: [location?.status ?? Date.now, Validators.required],
      update_at: [location?.status ?? Date.now, Validators.required],
    });
  }

  onSubmit(): void {
    this.servererror = false;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const locationData = this.form.getRawValue() as Location;

    if (this.data.action === 'add') {
      this.add(locationData);
    } else {
      this.edit(locationData);
    }
  }

  add(location: Location): void {
    this.serv.create(location).subscribe({
      next: (result: Location) => {
        this.dialogRef.close(result);
      },

      error: (error) => {
        console.error('Erreur lors de l’ajout du location :', error);

        this.servererror = true;
      },
    });
  }

  edit(location: Location): void {
    const id = this.data?.data?.id;

    if (!id) {
      console.error('ID du location manquant');
      this.servererror = true;
      return;
    }

    this.serv.update(id, location).subscribe({
      next: (result: Location) => {
        this.dialogRef.close(result);
      },

      error: (error) => {
        console.error('Erreur lors de la modification du location :', error);

        this.servererror = true;
      },
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
