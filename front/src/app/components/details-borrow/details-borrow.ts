import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Mov } from '../../../models/interfaces';

@Component({
  selector: 'app-details-borrow',
  standalone: true,

  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, MatTooltipModule],

  templateUrl: './details-borrow.html',
  styleUrl: './details-borrow.scss',
})
export class DetailsBorrow {
  mov: Mov;

  constructor(
    public dialogRef: MatDialogRef<DetailsBorrow>,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode?: string;
      item: Mov;
    },
  ) {
    this.mov = data.item;
  }

  /*
   * Fermer la fenêtre
   */
  close(): void {
    this.dialogRef.close();
  }

  /*
   * Classe CSS selon le statut
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'Emprunté':
        return 'status-borrowed';

      case 'En retard':
        return 'status-late';

      case 'Retourné':
        return 'status-returned';

      default:
        return '';
    }
  }

  /*
   * Icône selon le statut
   */
  getStatusIcon(status: string): string {
    switch (status) {
      case 'Emprunté':
        return 'schedule';

      case 'En retard':
        return 'warning';

      case 'Retourné':
        return 'check_circle';

      default:
        return 'info';
    }
  }
}
