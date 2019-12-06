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

  generarFacturaB() {
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
              type: 'none',
              ul: [
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
              type: 'none',
              ul: [
                'Nº factura:0001-000000001',
                'Fecha: 06/12/2019',
                'CUIT/CUIL: 23341441439',
                'Ingresos brutos: 0000000000',
                'Inicio de actividades: 01/01/2006']
            },]

        },

        {//Separador muy vago
          text: ' '
        },

        {
          columns: [
            {//Datos Comprador
              style: 'datosComprador',
              width: 'auto',
              alignment: 'left',
              type: 'none',
              ul: [
                'Razon social: {cliente.name}',
                'Domicilio: {cliente.domicilio}',
                'Condicion de venta: {venta.formaPago}']
            },
            {
              style: 'datosComprador',
              width: '*',
              alignment: 'right',
              type: 'none',
              ul: [
                'Telefono: {cliente.telefono}',
                'Fecha: {venta.fecha}',
                'DNI: {cliente.DNI}',
                'Condicion de IVA: {venta?.condicion}',]
            },]

        },
        {//Separador muy vago
          text: ' '
        },

        {
          table: {
            widths: [50, 'auto', '*', 'auto', 50, 50, 'auto'],
            body: [
              ['Cantidad', 'Cod', 'Descripcion', 'Prec.Unit.', 'IVA', 'Bonif.', 'Importe'],
              ['5', 'man01', 'Manaos Uva', '37', '21%', '100%', 'No tiene precio'],
              ['1', 'EVA01', 'Kenji te vas a subir al Eva o no la concha de tu madre', '99x10^45', '0%', '0%', 'Una banda'],  
            ]
          }
        },

        {//Separador muy vago
          text: ' '
        },

        {
          alignment: 'right',
          text: 'Importe total: ${importe loco}'
        },

        {//Separador muy vago
          text: ' '
        },

        {//Esto va a ser un dolor de huevos...
          text: 'Son Pesos SIETE MIL TRESCIENTOS OCHENTA Y CINCO con VEINTISEIS'
        }

      ],
      styles: {
        letraFactura: {
          bold: true,
          alignment: 'center',
          fontSize: 40,
        },
        datosComprador: {
          background: 'grey'
        }
      }
    };
    pdfMake.createPdf(documentDefinition).download("facturaB");
  }

  constructor() { }

  ngOnInit() {
  }

}
