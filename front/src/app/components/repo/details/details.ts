import { Component, Inject } from '@angular/core';
import { Repo } from '../../../services/repo';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details {
  rep: any;
  constructor(
    public dialogRef: MatDialogRef<Details>,
    @Inject(MAT_DIALOG_DATA) public data: { item: any },
  ) {
    this.rep = data.item;
    console.log("data", data.item)
    this.rep.location = this.getLocation(data.item.address)
  }

  getLocation(loc: any){
    const temp = loc.split('>');
    console.log("loc", temp.reverse());
    return temp;
  }
}
