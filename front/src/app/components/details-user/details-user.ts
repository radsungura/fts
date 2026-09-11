import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../models/interfaces';

@Component({
  selector: 'app-details-user',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './details-user.html',
  styleUrl: './details-user.scss',
})
export class DetailsUser {
  user: User | undefined;
  constructor(
    public dialogRef: MatDialogRef<DetailsUser>,
    @Inject(MAT_DIALOG_DATA) public data: { item: User },
  ) {
    this.user = data.item;
  }
}
