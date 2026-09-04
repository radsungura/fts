import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-details-doc',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './details-doc.html',
  styleUrl: './details-doc.scss'
})
export class DetailsDoc {
// route = inject(ActivatedRoute);
  document: any;
  constructor(public dialogRef: MatDialogRef<DetailsDoc>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ){
    }
    ngOnInit() {
    // const id = this.route.snapshot.paramMap.get('id');
    // Simule une récupération depuis un service
    
  }

}
