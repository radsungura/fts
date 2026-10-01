import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Repo } from '../../services/repo';
import { Document } from '../../services/document';
import { UserService } from '../../services/user';
import { Borrows } from '../../services/borrow';
import {Doc} from '../../../models/interfaces'

@Component({
  selector: 'app-delete',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './delete.html',
  styleUrl: './delete.scss',
})
export class Delete {
  servererror: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<Delete>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private locs: Repo,
    private docs: Document,
    private users: UserService,
    private borrows: Borrows,

  ) {
    console.log('Delete dialog data:', data);
  }

  async delete() {
    console.log('Delete dialog data:', this.data);
    let data = this.data.data;
    if (this.data.item === 'document') {
      try {
        await this.docs.delete(data.id).subscribe((el) => {
          this.dialogRef.close(el); // renvoie les données modifiées
        });
      } catch (error){
        console.error("error", error);
        this.servererror = true;
      }
    };
     if (this.data.item === 'location') {
      try {
        await this.locs.delete(data.id).subscribe((el) => {
          this.dialogRef.close(el); // renvoie les données modifiées
        });
      } catch (error){
        console.error("error", error);
        this.servererror = true;
      }
    };
     if (this.data.item === 'borrow') {
      try {
        await this.borrows.delete(data.id).subscribe((el) => {
          this.dialogRef.close(el); // renvoie les données modifiées
        });
      } catch (error){
        console.error("error", error);
        this.servererror = true;
      }
    };
     if (this.data.item === 'user') {
      try {
        await this.users.delete(data.id).subscribe((el) => {
          this.dialogRef.close(el); // renvoie les données modifiées
        });
      } catch (error){
        console.error("error", error);
        this.servererror = true;
      }
    };
    // this.dialogRef.close(true);
  
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
