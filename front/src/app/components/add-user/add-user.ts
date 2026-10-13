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
import { UserService } from '../../services/user';
import { User } from '../../../models/interfaces';

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
  users: User[] = [];
  // Rôles disponibles
  roles = ['Administrateur', 'Utilisateur', 'Gestionnaire', 'Archiviste'];

  // Statuts disponibles
  statuses = ['Actif', 'Inactif'];
  uexist: boolean = false;
  uname: string = "";

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUser>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serv: UserService
  ) {
    const user = data?.item;
    const isAddMode = data?.mode === 'add';
    const passwordValidators = [
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
    ];
    
    // if (isAddMode) {
    //   passwordValidators.unshift(Validators.required);
    // }

    this.form = this.fb.group({
        id: [user?.id ?? ''],
        lname: [user?.lname ?? '', Validators.required],
        fname: [user?.fname ?? '', Validators.required],
        uname: [user?.uname ?? '', Validators.required],
        email: [user?.email ?? '', [Validators.required, Validators.email]],
        role: [user?.role ?? '', Validators.required],
        pass: [user?.pass ?? ''],
        passtemp: [user?.passtemp ?? ''],
        status: [user?.status ?? 'Actif', Validators.required],
        created_at: [user?.created_at ?? ''],
        updated_at: [user?.updated_at ?? ''],
        // password: ['', passwordValidators],
        // confirmPassword: ['', isAddMode ? Validators.required : []],
      },
      // {
      //   validators: this.passwordMatchValidator,
      // },
    );
    
    this.serv.getAll().subscribe(el => {
      this.users = el;
    })
  }
  // passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  //   const password = control.get('password')?.value;
  //   const confirmPassword = control.get('confirmPassword')?.value;
  //   // En modification, les deux champs peuvent rester vides.
  //   if (!password && !confirmPassword) {
  //     return null;
  //   }
  //   return password === confirmPassword ? null : { passwordMismatch: true };
  // }

  // getPasswordStrength(): string {
  //   const password = this.form.get('password')?.value ?? '';
  //   if (!password) {
  //     return '';
  //   }

  //   let score = 0;

  //   if (password.length >= 8) {
  //     score++;
  //   }

  //   if (/[a-z]/.test(password)) {
  //     score++;
  //   }

  //   if (/[A-Z]/.test(password)) {
  //     score++;
  //   }

  //   if (/\d/.test(password)) {
  //     score++;
  //   }

  //   if (/[^A-Za-z0-9]/.test(password)) {
  //     score++;
  //   }

  //   if (score <= 2) {
  //     return 'Faible';
  //   }

  //   if (score <= 4) {
  //     return 'Moyen';
  //   }

  //   return 'Fort';
  // }

  onSubmit(): void {
    let checkuname = this.checkUname(this.uname);
    if (this.form.invalid && !checkuname) {
      this.form.markAllAsTouched();
      return;
    }
    const userData = this.form.getRawValue();
    if (this.data.mode == 'add') {
      if(userData){
        
        const pass = this.passgenerate();
        userData.passtemp = pass;
        userData.pass = '';
        userData.created_at = new Date();
      }
      this.add(userData);
    } else {
      userData.updated_at = new Date();
      this.edit(userData);
    }
  }

  // onSubmit() {

    // if (this.form.valid) {
    //   const formValue = this.form.value;
    //   // En modification, ne pas envoyer un mot de passe vide.
    //   // if (this.data?.mode !== 'add' && !formValue.password) {
    //   //   delete formValue.password;
    //   //   delete formValue.confirmPassword;
    //   // }

    //   // La confirmation ne doit jamais être envoyée au backend.
    //   delete formValue.confirmPassword;
    //   this.dialogRef.close(formValue);
    // }
  // }

  add(doc: User): void {
    this.serv.create(doc).subscribe({
      next: (result: User) => {
        this.dialogRef.close(result);
      },

      error: (error) => {
        console.error('Erreur lors de l’ajout du document :', error);
        // this.servererror = true;
      },
    });
  }

  edit(doc: User): void {
    const id = this.data?.item?.id;
    if (!id) {
      console.error('ID du document manquant');
      // this.servererror = true;
      return;
    }
    if(doc){
    }

    this.serv.update(id, doc).subscribe({
      next: (result: User) => {
        this.dialogRef.close(result);
      },

      error: (error) => {
        console.error('Erreur lors de la modification du document :', error);
        // this.servererror = true;
      },
    });
  }

  passgenerate(){
    const rand = (n = 8) => crypto.randomUUID().replace(/-/g, '').slice(0, n);
    // console.log(rand(6));
    return rand(6);
  }

  initpass(){
    const pass = this.passgenerate();
    let data = this.form.getRawValue();
    data.passtemp = pass;
    data.pass = "";
    this.serv.update(data.id, data).subscribe({
      next: (result: any) => {
        this.form.setValue(result);
        // this.dialogRef.close(result);
      },

      error: (error) => {
        console.error('Erreur lors de la modification du document :', error);
        // this.servererror = true;
      },
    });
    console.log(this.data, data);

    
  }

  checkUname(uname: string){
    let exist = this.users.find(el=> el.uname === uname);
    this.uexist = exist? true : false;
    return this.uexist;
  }
}
