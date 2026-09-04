import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Doc, Mov } from '../../../models/interfaces';
import { Document } from '../../services/document';
import { CommonModule } from '@angular/common';
import { Borrows } from '../../services/borrow';
@Component({
  selector: 'app-add-borrow',
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './add-borrow.html',
  styleUrl: './add-borrow.scss'
})
export class AddBorrow {
  form: any;
  doc: any;
  formData: any;
  servererror: boolean = false;
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddBorrow>,
    @Inject(MAT_DIALOG_DATA) public data: any, public serv: Borrows){
    if (data.action === 'edit' && data.data) {
        this.doc = { ...data.data };
    }else{
      this.doc = {};
    }

    this.form = this.fb.group({
      title: [this.data.title, Validators.required],
      reference: [this.data.reference, Validators.required],
      category: [this.data.category, Validators.required],
      location: [this.data.location, Validators.required],
      status: [this.data.status, Validators.required]
    });
    
    this.doc = {};
    this.doc = this.data.data? this.data.data: {};
    console.log("edit item", this.data.data);
    
  }

  edit(item: Mov) {
    if (this.form.valid) {
      this.serv.update(item.id, item).subscribe((el: any) => {
        this.dialogRef.close(el); // renvoie les données modifiées
      })
    }else{
      this.servererror = true;
    }
  }

  add(item: Mov) {    
    if (this.form.valid) {
      this.serv.create(item).subscribe((el: any) => {
        this.dialogRef.close(el); // renvoie les données modifiées
      })
    }else{
      this.servererror = true;
    }
  }
}