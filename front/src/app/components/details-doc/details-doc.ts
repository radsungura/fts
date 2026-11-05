import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cat, Doc, Mov, Serv } from '../../../models/interfaces';
import { ServService } from '../../services/services';
import { CatService } from '../../services/categories';
import { MovService } from '../../services/borrow';

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
  cats: Cat[] = [];
  movs: Mov[] = [];
  display: 'details' | 'history' = 'details';

  constructor(
    public dialogRef: MatDialogRef<DetailsDoc>,
    @Inject(MAT_DIALOG_DATA)
    public data: { item: Doc }, private serv: ServService,
    private cat: CatService,
    private mov: MovService

  ){
    this.serv.getAll().subscribe(serv=>{
      this.cat.getAll().subscribe(cat=>{
        this.cats = cat;
        this.servcs = serv;
        this.document = data.item;
        this.document.address = this.getLocation(data.item.location);
        this.document.serv = this.getServ(data.item.dept_id);
        this.document.cat = this.getCategory(data.item.category);
        console.log(this.document);
      });
    });
  }



  history(){
    this.display = this.display === 'details'? 'history' : 'details';
    this.mov.getAll().subscribe(movs=>{
      let data = movs.filter(el=>el.documentId === this.document.id);
      this.movs = data.length? data : [];
      console.log("mov", this.movs);
    });
  }
  getLocation(loc: any){
    console.log("loc", loc);
    const temp = loc.split('/');
    return temp;
  }
  getServ(serv: any){
    const res = this.servcs.find(el => el.id === serv)?.name
    return res;
  }
  getCategory(cat: any){
    const res = this.cats.find(el => el.id == cat);
    return res?.name;
  }
  close(): void {
    this.dialogRef.close();
  }
}
