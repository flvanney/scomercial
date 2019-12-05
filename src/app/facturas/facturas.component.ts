import { Component, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-factura',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturaComponent implements OnInit {

  generatePdf(){
    const documentDefinition = { content: 'Deberia andar' };
    pdfMake.createPdf(documentDefinition).download();
  }

  constructor() { }

  ngOnInit() {
  }

}
