import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-barcode-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './barcode-dialog.html',
  styleUrl: './barcode-dialog.scss',
})
export class BarcodeDialog implements AfterViewInit {
  @ViewChild('barcode', { static: false })
  barcode!: ElementRef<SVGElement>;

  barcodeValue = '';

  constructor(
    public dialogRef: MatDialogRef<BarcodeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    const documentId = data?.document?.id;

    /*
     * On crée une référence lisible :
     * Exemple : DOC-000125
     */
    this.barcodeValue = this.formatBarcode(documentId);
  }

  ngAfterViewInit(): void {
    this.generateBarcode();
  }

  formatBarcode(id: any): string {
    if (id === undefined || id === null || id === '') {
      return 'DOC-UNKNOWN';
    }

    const numericId = Number(id);

    if (!isNaN(numericId)) {
      return `DOC-${numericId.toString().padStart(6, '0')}`;
    }

    return `DOC-${id}`;
  }

  generateBarcode(): void {
    if (!this.barcode?.nativeElement) {
      return;
    }

    JsBarcode(this.barcode.nativeElement, this.barcodeValue, {
      format: 'CODE128',
      width: 2,
      height: 70,
      displayValue: true,
      fontSize: 18,
      margin: 10,
      textMargin: 8,
    });
  }
  escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  printBarcode(): void {
    const documentTitle = this.data?.document?.title ?? '';
    const reference = this.data?.document?.reference ?? '';
    const codebar = this.data?.document?.codebar ?? '';
    const category = this.data?.document?.category ?? '';
    const location = this.data?.document?.location ?? '';

    const barcodeSvg = this.barcode.nativeElement.outerHTML;

    const printWindow = window.open('', '_blank', 'width=700,height=700');

    if (!printWindow) {
      return;
    }

    printWindow.document.open();

    printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">

      <title>Étiquette - ${codebar}</title>

      <style>
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 20px;

          font-family: Arial, Helvetica, sans-serif;

          background: white;
          color: #222;
        }

        .label {
          width: 90mm;
          min-height: 65mm;

          margin: 0 auto;
          padding: 8mm;

          border: 1px solid #333;
          border-radius: 4px;

          text-align: center;
        }

        .header {
          font-size: 18px;
          font-weight: bold;

          margin-bottom: 5mm;
        }

        .title {
          font-size: 15px;
          font-weight: bold;

          margin-bottom: 3mm;

          word-break: break-word;
        }

        .info {
          font-size: 11px;
          text-align: left;

          margin-bottom: 4mm;
        }

        .info div {
          margin-bottom: 1.5mm;
        }

        .barcode {
          display: flex;
          justify-content: center;
          align-items: center;

          margin-top: 4mm;
        }

        .barcode svg {
          width: 70mm;
          height: auto;
        }

        .barcode-number {
          margin-top: 2mm;

          font-size: 13px;
          font-weight: bold;

          letter-spacing: 1px;
        }

        @page {
          size: auto;
          margin: 10mm;
        }

        @media print {
          body {
            padding: 0;
          }

          .label {
            margin: 0;
            border: 1px solid #333;
          }
        }
      </style>
    </head>

    <body>

      <div class="label">

        <div class="header">
          FTS
        </div>

        <div class="title">
          ${this.escapeHtml(documentTitle)}
        </div>

        <div class="info">

          <div>
            <strong>Référence :</strong>
            ${this.escapeHtml(reference)}
          </div>

          <div>
            <strong>Catégorie :</strong>
            ${this.escapeHtml(category)}
          </div>

          <div>
            <strong>Localisation :</strong>
            ${this.escapeHtml(location)}
          </div>

        </div>

        <div class="barcode">
          ${barcodeSvg}
        </div>

        <div class="barcode-number">
          ${this.escapeHtml(codebar)}
        </div>

      </div>

      <script>
        window.onload = function() {
          window.focus();
          window.print();
        };
      </script>

    </body>
    </html>
  `);

    printWindow.document.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
