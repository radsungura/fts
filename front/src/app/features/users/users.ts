import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DetailsUser } from '../../components/details-user/details-user';
import { AddUser } from '../../components/add-user/add-user';
import { Delete } from '../../components/delete/delete';
import { User } from '../../../models/interfaces';
import { UserService } from '../../services/user';
@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'statut', 'actions'];
  users: User[] = [];
  loading = false;
  searchText = '';
  statusFilter = 'Tous';
  filteredUsers: User[] = [];
  pageSize = 5;
  pageIndex = 0;
  totalUsers = 0;
  activeUsers = 0;
  inactiveUsers = 0;
  constructor(
    private dialog: MatDialog,
    private data: UserService,
    private snackBar: MatSnackBar,
  ) {}
  ngOnInit() {
    this.loadUsers();
  }
  loadUsers() {
    this.loading = true;

    this.data.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;

        this.totalUsers = users.length;

        this.activeUsers = users.filter((user) => user.status === 'Actif').length;

        this.inactiveUsers = users.filter((user) => user.status === 'Inactif').length;

        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des utilisateurs :', error);

        this.loading = false;

        this.snackBar.open('Impossible de charger les utilisateurs', 'Fermer', {
          duration: 4000,
        });
      },
    });
  }

  searchUsers() {
    const search = this.searchText.toLowerCase().trim();

    this.filteredUsers = this.users.filter((user) => {
      const matchesSearch =
        !search ||
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search) ||
        user.status.toLowerCase().includes(search);

      const matchesStatus = this.statusFilter === 'Tous' || user.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.pageIndex = 0;
  }

  changePage(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  add() {
    const dialogRef = this.dialog.open(AddUser, {
      width: '90vw',
      maxHeight: '1000vh',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.data.create(result).subscribe({
          next: () => {
            this.loadUsers();

            this.snackBar.open('Utilisateur ajouté avec succès', 'Fermer', {
              duration: 3000,
            });
          },
          error: (error) => {
            this.snackBar.open('Erreur lors de l’ajout de l’utilisateur', 'Fermer', {
              duration: 4000,
            });
          },
        });
      }
    });
  }

  details(user: any) {
    console.log('📄 Détails du user :', user);
    // Naviguer vers une page ou ouvrir une modale
    const dialogRef = this.dialog.open(DetailsUser, {
      width: '90vw', // ou '80vw' pour responsive
      maxHeight: '1000vh',
      data: { mode: 'details', item: user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.usersService.adduser(result).subscribe(() => this.loadusers());
      }
    });
  }

  edit(user: User) {
    console.log('✏️ Modifier le user :', user);

    const dialogRef = this.dialog.open(AddUser, {
      width: '90vw',
      maxHeight: '1000vh',
      data: {
        mode: 'edit',
        item: user,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && user.id) {
        this.data.update(user.id, result).subscribe({
          next: () => {
            this.loadUsers();

            this.snackBar.open('Utilisateur modifié avec succès', 'Fermer', {
              duration: 3000,
            });
          },
          error: () => {
            this.snackBar.open('Erreur lors de la modification de l’utilisateur', 'Fermer', {
              duration: 4000,
            });
          },
        });
      }
    });
  }

  delete(user: User) {
    console.log('🗑️ Supprimer le user :', user);

    const dialogRef = this.dialog.open(Delete, {
      width: '500px',
      data: {
        mode: 'user',
        item: user,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && user.id) {
        this.data.delete(user.id).subscribe({
          next: () => {
            this.loadUsers();

            this.snackBar.open('Utilisateur supprimé avec succès', 'Fermer', {
              duration: 3000,
            });
          },
          error: () => {
            this.snackBar.open('Erreur lors de la suppression de l’utilisateur', 'Fermer', {
              duration: 4000,
            });
          },
        });
      }
    });
  }
}
