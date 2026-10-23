import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Doc, Serv } from '../../../models/interfaces';
import { ServService } from '../../services/services';

@Component({
  selector: 'app-details-doc',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './details-doc.html',
  styleUrl: './details-doc.scss',
})
export class DetailsDoc {
  document: any | undefined;
  servcs: Serv[] = [];

  constructor(
    public dialogRef: MatDialogRef<DetailsDoc>,
    @Inject(MAT_DIALOG_DATA)
    public data: { item: Doc }, private serv: ServService
  ){
    this.serv.getAll().subscribe(el=>{
      this.servcs = el;
    this.document = data.item;
    this.document.address = this.getLocation(data.item.location);
    this.document.dept_id = this.getServ(data.item.dept_id);
    })
    
  }

  getLocation(loc: any){
    const temp = loc.split('/');
    // console.log("loc", temp.reverse());
    return temp;
  }
  getServ(serv: any){
    const res = this.servcs.find(el => el.id === serv)?.name
    return res;
  }
  close(): void {
    this.dialogRef.close();
  }
}
