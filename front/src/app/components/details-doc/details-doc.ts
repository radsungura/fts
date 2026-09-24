import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Doc } from '../../../models/interfaces';

@Component({
  selector: 'app-details-doc',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './details-doc.html',
  styleUrl: './details-doc.scss',
})
export class DetailsDoc {
  document: Doc | undefined;

  constructor(
    public dialogRef: MatDialogRef<DetailsDoc>,
    @Inject(MAT_DIALOG_DATA)
    public data: { item: Doc },
  ) {
    this.document = data.item;
  }

  close(): void {
    this.dialogRef.close();
  }
}
