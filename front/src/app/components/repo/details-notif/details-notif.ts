import { Component, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-details-notif',
  imports: [MatCardModule],
  templateUrl: './details-notif.html',
  styleUrl: './details-notif.scss'
})
export class DetailsNotif {
 constructor(public dialogRef: MatDialogRef<DetailsNotif>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ){
    }
}
