import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

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
  ) {}
  delete() {
    // On confirme simplement la suppression
    // users.ts effectuera réellement le DELETE
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
