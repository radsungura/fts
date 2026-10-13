import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { Document } from '../../services/document';
import { BarcodeFormat } from '@zxing/library';
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
  constructor(private docService: Document) {}

  onCodeScanned(result: string) {
    console.log("data", result);
  // 'result' est la valeur brute du code-barres
  this.docService.findByCode(result).subscribe(doc => {
    alert(`Document trouvé : ${doc.title} (ID: ${doc.id})`);
    // Affiche les infos du document
  });
}
}
