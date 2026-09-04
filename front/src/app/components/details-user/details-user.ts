import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-details-user',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './details-user.html',
  styleUrl: './details-user.scss'
})
export class DetailsUser {
user: any;
  constructor(public dialogRef: MatDialogRef<DetailsUser>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ){
    }
}
