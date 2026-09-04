import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-details-borrow',
  imports: [MatCardModule, MatButton],
  templateUrl: './details-borrow.html',
  styleUrl: './details-borrow.scss'
})
export class DetailsBorrow {
constructor(public dialogRef: MatDialogRef<DetailsBorrow>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ){
    }
}
