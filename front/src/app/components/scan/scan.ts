import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { Document } from '../../services/document';
import { BarcodeFormat } from '@zxing/library';
import { Doc } from '../../../models/interfaces';
import { DetailsDoc } from '../details-doc/details-doc';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-scan',
  imports: [ZXingScannerModule],
  templateUrl: './scan.html',
  styleUrl: './scan.scss',
})
export class Scan {
  // Expose l'énumération au template
  BarcodeFormat = BarcodeFormat;

  // Ou définissez directement les formats autorisés
  allowedFormats: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE
  ];
  docs : Doc[]=[];
  doc : any = {};
  constructor(private docService: Document, public dialog: MatDialog) {
    this.docService.getAll().subscribe(el =>{
      this.docs = el;
    })
  }

  onCodeScanned(result: string) {
    console.log("data", result);
  // 'result' est la valeur brute du code-barres
  this.doc = this.docs.find((el: any) => el.code === result);
  this.details(this.doc);
    // Affiche les infos du document
  };

  details(doc: Doc) {
    this.dialog.open(DetailsDoc, {
      width: '90vw',
      maxHeight: '1000vh',
      data: {
        action: 'details',
        item: doc,
      },
    });
  }
}
