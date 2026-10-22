import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CatService } from '../../services/categories';
import { Cat } from '../../../models/interfaces';

@Component({
  selector: 'app-add-cat',
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
  templateUrl: './add-cat.html',
  styleUrl: './add-cat.scss',
})
export class AddCat {
  form;
  cats: Cat[] = [];
  statuses = ['Actif', 'Inactif'];
  exist: boolean = false;
  code: string = "";

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddCat>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serv: CatService
  ) {
    const cat = data?.item;
    const isAddMode = data?.mode === 'add';
    this.form = this.fb.group({
        id: [cat?.id ?? ''],
        name: [cat?.name ?? '', Validators.required],
        code: [cat?.code ?? '', Validators.required],
        desc: [cat?.desc ?? '', Validators.required],
        status: [cat?.status ?? 'Actif', Validators.required],
        created_at: [cat?.created_at ?? ''],
        updated_at: [cat?.updated_at ?? ''],
      }
    );
    
    this.serv.getAll().subscribe(el => {
      this.cats = el;
      console.log(this.cats);
      
    });
  this.exist = false;

  }
 

  onSubmit(): void {
    let checkuname = this.checkName(this.form.getRawValue().code);
    if (this.form.invalid && !checkuname) {
      this.form.markAllAsTouched();
      return;
    }
    const catData = this.form.getRawValue();
    if (this.data.mode == 'add') {
      if(catData){
        catData.id = this.idgenerate()
        catData.created_at = new Date();
        catData.updated_at = new Date();
      }
      this.add(catData);
    } else {
      catData.updated_at = new Date();
      this.edit(catData);
    }
  }
   idgenerate(){
    const rand = (n = 8) => crypto.randomUUID().replace(/-/g, '').slice(0, n);
    return rand(6);
  }
  add(doc: Cat): void {
    this.serv.create(doc).subscribe({
      next: (result: Cat) => {
        this.dialogRef.close(result);
      },

      error: (error) => {
        console.error('Erreur lors de l’ajout du catégorie :', error);
        // this.servererror = true;
      },
    });
  }

  edit(doc: Cat): void {
    const id = this.data?.item?.id;
    if (!id) {
      console.error('ID du document manquant');
      return;
    }

    this.serv.update(id, doc).subscribe({
      next: (result: Cat) => {
        this.dialogRef.close(result);
      },

      error: (error) => {
        console.error('Erreur lors de la modification du catégorie :', error);
      },
    });
  }

  checkName(ref: string){
    let res = this.cats.find(el=> el.code === ref);
    this.exist = res? true : false;
    return this.exist;
  }
}
