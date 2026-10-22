import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Serv, User } from '../../../models/interfaces';
import { ServService } from '../../services/services';

@Component({
  selector: 'app-details-user',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './details-user.html',
  styleUrl: './details-user.scss',
})
export class DetailsUser {
  user: any | {} = {};
  serv: Serv[]=[];
  constructor(
    public dialogRef: MatDialogRef<DetailsUser>,
    @Inject(MAT_DIALOG_DATA) public data: { item: User },
    private srv: ServService
  ) {
    
    this.srv.getAll().subscribe(el=>{
      this.serv = el;
      this.user = data.item;
      this.user.service = this.getServ(data.item.service);
    })
  }
  getServ(serv: any){
    const res = this.serv.find(el => el.id ==serv)?.name;
    return res;
  }
}
