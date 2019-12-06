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
    const documentDefinition = {
      pageSize: 'A4',
      content: [
        {//Letra de la factura
          text: 'B', style: 'letraFactura'
        },
        {
          columns: [
            {//Datos Empresa
              width: 'auto',
              alignment: 'left',
              stack: [
                'FACTURA Original',
                'UNNOBA', 
                'Monteagudo 2700',
                'Pergamino Buenos Aires',
                'Tel:2477-412345',
                'Responsable Inscripto',]
            },
            {
              width: '*',
              alignment: 'right',
              stack: [
                'Nº factura:0001-000000001',
                'Fecha: 06/12/2019',
                'CUIT/CUIL: 23341441439',
                'Ingresos brutos: 0000000000',
                'Inicio de actividades: 01/01/2006']
            },]

        },

      ],
      styles: {
        letraFactura: {
          bold: true,
          alignment: 'center',
          fontSize: 40,
        }
      }
    };
    pdfMake.createPdf(documentDefinition).download();
  }

  constructor() { }

  ngOnInit() {
  }

}
