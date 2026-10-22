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
import { ServService } from '../../services/services';
import { Serv } from '../../../models/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-serv',
  imports: [  CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,],
  templateUrl: './add-serv.html',
  styleUrl: './add-serv.scss',
})
export class AddServ {
 form;
  servs: Serv[] = [];
  // Rôles disponibles
  roles = ['Administrateur', 'Utilisateur', 'Gestionnaire', 'Archiviste'];
  services = ['Juridique', 'Crédit', 'Commerciale'];

  // Statuts disponibles
  statuses = ['Actif', 'Inactif'];
  exist: boolean = false;
  ref: string = "";

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddServ>,
    @Inject(MAT_DIALOG_DATA) public data: any, private srvc: ServService, private snackBar: MatSnackBar,
  ) {
    const serv = data?.item;
    const isAddMode = data?.mode === 'add';
    this.form = this.fb.group({
        id: [serv?.id ?? ''],
        name: [serv?.name ?? '', Validators.required],
        code: [serv?.code ?? '', Validators.required],
        desc: [serv?.desc ?? '', Validators.required],
        status: [serv?.status ?? 'Actif', Validators.required],
        created_at: [serv?.created_at ?? ''],
        updated_at: [serv?.updated_at ?? ''],
      }
    );
    
    this.srvc.getAll().subscribe(el => {
      this.servs = el;
      console.log(this.servs);
      
    });
  this.exist = false;

  }
 

  onSubmit(): void {
    let checkref = false;
    if(this.data.mode !== 'edit'){
      checkref = this.checkName(this.form.getRawValue().code);
    }

    if (this.form.invalid && !checkref) {
      this.form.markAllAsTouched();
      return;
    }
    const servData = this.form.getRawValue();
    if (this.data.mode == 'add') {
      if(servData){
        servData.id = this.idgenerate()
        servData.created_at = new Date();
        servData.updated_at = new Date();
      }
      this.add(servData);
    } else {
      servData.updated_at = new Date();
      this.edit(servData);
    }
  }
   idgenerate(){
    const rand = (n = 8) => crypto.randomUUID().replace(/-/g, '').slice(0, n);
    return rand(6);
  }
  add(doc: Serv): void {
    this.srvc.create(doc).subscribe({
      next: (result: Serv) => {
        this.dialogRef.close(result);
      },

      error: (error) => {
        console.error('Erreur lors de l’ajout du servégorie :', error);
        // this.servererror = true;
      },
    });
  }

  edit(doc: Serv): void {
    const id = this.data?.item?.id;
    if (!id) {
      console.error('ID du document manquant');
      // this.servererror = true;
      return;
    }
    if(doc){
    }

    this.srvc.update(id, doc).subscribe({
      next: (result: Serv) => {
        this.dialogRef.close(result);
        this.snackBar.open('catégorie modifié avec succès', 'Fermer', {
          duration: 3000,
        });
      },

      error: (error) => {
        this.snackBar.open('Erreur lors de la modification du catégorie', 'Fermer', {
          duration: 4000,
        });
      },
    });
  }

  checkName(ref: string){
    let res = this.servs.find(el=> el.code === ref && ref.length >= 3);
    this.exist = res? true : false;
    return this.exist;
  }
}
