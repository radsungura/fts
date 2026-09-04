import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Document } from '../../services/document';
import { Doc } from '../../../models/interfaces';

@Component({
  selector: 'app-delete',
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './delete.html',
  styleUrl: './delete.scss'
})
export class Delete {
form: any;
doc: any;
servererror: boolean = false;
constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<Delete>,
    @Inject(MAT_DIALOG_DATA) public data: any, public serv: Document){

}
 async delete() {
  
  try {
    await this.serv.delete(25).subscribe((el) => {
      this.dialogRef.close(el); // renvoie les données modifiées
    });
  } catch (error){
    console.error("error", error);
    this.servererror = true;
  }
}
}

