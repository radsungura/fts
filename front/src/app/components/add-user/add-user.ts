import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddDoc } from '../add-doc/add-doc';

@Component({
  selector: 'app-add-user',
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './add-user.html',
  styleUrl: './add-user.scss'
})
export class AddUser {
form: any;
constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddDoc>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
  // if (data.mode === 'edit' && data.document) {
  //     this.formData = { ...data.document };
  //   }

  this.form = this.fb.group({
    titre: [this.data.titre, Validators.required],
    categorie: [this.data.categorie],
    localisation: [this.data.localisation],
    statut: [this.data.statut]
  });
}
onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value); // renvoie les données modifiées
    }
  }
}
