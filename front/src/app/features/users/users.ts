import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog   } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DetailsUser } from '../../components/details-user/details-user';
import { AddUser } from '../../components/add-user/add-user';
import { Delete } from '../../components/delete/delete';
import { User } from '../../../models/interfaces';
import { UserService } from '../../services/user'
@Component({
  selector: 'app-users',
  imports: [MatTableModule, MatToolbarModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users {
displayedColumns: string[] = ['id', 'name', 'email', 'role', 'statut', 'actions'];
  users : User[] = [];
  constructor(private dialog: MatDialog, private data: UserService){

  }
  ngOnInit() {
    this.loadUsers();
  }
  loadUsers() {
    this.data.getAll().subscribe((users) => (this.users = users));
  }
  add(){
    const dialogRef = this.dialog.open(AddUser, {
      width: '90vw', // ou '80vw' pour responsive
      maxHeight: '1000vh',

      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.usersService.adduser(result).subscribe(() => this.loadusers());
      }
    });
  }

  details(user: any) {
  console.log('📄 Détails du user :', user);
  // Naviguer vers une page ou ouvrir une modale
   const dialogRef = this.dialog.open(DetailsUser, {
      width: '90vw', // ou '80vw' pour responsive
      maxHeight: '1000vh',
      data: { mode: 'details', item: user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.usersService.adduser(result).subscribe(() => this.loadusers());
      }
    });
}

edit(user: any) {
  console.log('✏️ Modifier le user :', user);
  // Naviguer vers un formulaire ou afficher une modale
  const dialogRef = this.dialog.open(AddUser, {
      width: '90vw', // ou '80vw' pour responsive
      maxHeight: '1000vh',
      data: { mode: 'edit' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.usersService.adduser(result).subscribe(() => this.loadusers());
      }
    });
}

delete(user: any) {
  console.log('🗑️ Supprimer le user :', user);
  // Confirmer et supprimer via API ou service
  const dialogRef = this.dialog.open(Delete, {
      width: '90vw', // ou '80vw' pour responsive
      maxHeight: '1000vh',
      data: { mode: 'user' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.usersService.adduser(result).subscribe(() => this.loadusers());
      }
    });
}

}
