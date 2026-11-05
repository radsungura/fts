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
import { Delete } from '../../components/delete/delete';
import { RolesService } from '../../services/roles';
import { Role } from '../../../models/interfaces';
import { DetailsRole } from '../../components/details-role/details-role';
import { AddRole } from '../../components/add-role/add-role';

@Component({
  selector: 'app-roles',
  imports: [ CommonModule,
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
  templateUrl: './roles.html',
  styleUrl: './roles.scss',
})
export class Roles {
 displayedColumns: string[] = ['id', 'code', 'name', 'desc', 'statut', 'actions'];
   Role: Role[] = [];
   loading = false;
   searchText = '';
   statusFilter = 'Tous';
   filtered: Role[] = [];
   pageSize = 5;
   pageIndex = 0;
   totalRole = 0;
   activeRole = 0;
   inactiveRole = 0;
   constructor(
     private dialog: MatDialog,
     private serv: RolesService,
     private snackBar: MatSnackBar,
   ) {}
   ngOnInit() {
     this.loadRole();
   }
   loadRole() {
     this.loading = true;
     this.serv.getAll().subscribe({
       next: (Role) => {
         this.Role = Role;
         this.filtered = Role;
         this.totalRole = Role.length;
         this.activeRole = Role.filter((Role) => Role.status === 'Actif').length;
         this.inactiveRole = Role.filter((Role) => Role.status === 'Inactif').length;
         this.loading = false;
       },
       error: (error) => {
         console.error('❌ Erreur lors du chargement des Roleices :', error);
         this.loading = false;
         this.snackBar.open('Impossible de charger les Roleices', 'Fermer', {
           duration: 4000,
         });
       },
     });
   }
 
   search() {
     const search = this.searchText.toLowerCase().trim();
 
     this.filtered = this.Role.filter((Role) => {
       const matchesSearch =
         !search ||
         Role.name.toLowerCase().includes(search) ||
         Role.desc.toLowerCase().includes(search) ||
         Role.code.toLowerCase().includes(search) ||
         Role.status.toLowerCase().includes(search);
 
       const matchesStatus = this.statusFilter === 'Tous' || Role.status === this.statusFilter;
 
       return matchesSearch && matchesStatus;
     });
 
     this.pageIndex = 0;
   }
 
   changePage(event: any) {
     this.pageIndex = event.pageIndex;
     this.pageSize = event.pageSize;
   }
 
   add() {
     const dialogRef = this.dialog.open(AddRole, {
       width: '90vw',
       maxHeight: '1000vh',
       data: { mode: 'add' },
     });
 
     dialogRef.afterClosed().subscribe((result) => {
       if (result) {
         this.serv.create(result).subscribe({
           next: () => {
             this.loadRole();
 
             this.snackBar.open('Roleice ajouté avec succès', 'Fermer', {
               duration: 3000,
             });
           },
           error: (error) => {
             this.snackBar.open('Erreur lors de l’ajout du Roleice', 'Fermer', {
               duration: 4000,
             });
           },
         });
       }
     });
   }
 
   details(Role: any) {
     const dialogRef = this.dialog.open(DetailsRole, {
       width: '90vw', // ou '80vw' pour responsive
       maxHeight: '1000vh',
       data: { mode: 'details', item: Role },
     });
   }
 
   edit(Role: Role) {
     const dialogRef = this.dialog.open(AddRole, {
       width: '90vw',
       maxHeight: '1000vh',
       data: {
         mode: 'edit',
         item: Role,
       },
     });
 
     dialogRef.afterClosed().subscribe((result) => {
       if (result && Role.id) {
            this.loadRole();
       }
     });
   }
 
   delete(Role: Role) {
     const dialogRef = this.dialog.open(Delete, {
       width: '500px',
       data: {
         action: 'delete',
         item: 'Role',
         data: Role,
       },
     });
 
     dialogRef.afterClosed().subscribe((result) => {
       if (result) {
             this.loadRole();
       }
     });
   }
 }
 