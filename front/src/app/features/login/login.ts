import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class Login {
  
  loginForm: FormGroup;

  username = '';
  password = '';
  error = '';
  users= [
    { "id": 1, "username": "admin", "password": "admin123", "role": "admin" },
    { "id": 2, "username": "bob", "password": "bob123", "role": "user" }
  ]
  router: any;
  constructor(private fb: FormBuilder, private route: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('✅ Connexion réussie :', this.loginForm.value);
      this.route.navigate(['/dashboard']);

      // Ajoute ici ta logique d’authentification ou de redirection
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

}
