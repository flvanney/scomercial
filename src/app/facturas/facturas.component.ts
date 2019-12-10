import { Component, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { Venta } from '../ventas/venta';
import { Cliente } from '../clientes/cliente';
import { Articulo } from '../articulos/articulo';
import { ClientesService } from '../clientes/clientes.service';
import { ArticulosService } from '../articulos/articulos.service';
import { VentasService } from '../ventas/venta.service';

@Component({
  selector: 'app-factura',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})

export class FacturaComponent{

  ventas: Venta[] = null;

  constructor(
    private articulosService: ArticulosService,
    private ventasService: VentasService,
    private clientesService: ClientesService
  ) {}

  ngOnInit() {
    this.ventasService.traerVentas().subscribe((ventas: Venta[]) => {
      this.ventas = ventas;
    })
  }

  generarFacturaB(){
    return this.facturado("Factura ORIGINAL", "B"), this.facturado("Factura COPIA", "B");
  }

  generarFacturaA(){
    return this.facturado("Factura ORIGINAL", "A"), this.facturado("Factura COPIA", "A");
  }

  facturado(tipo, letra: String) {
    const facturaOriginal = {
      pageSize: 'A4',
      content: [
        {//Letra de la factura
          text: letra,
          style: 'letraFactura',
        },
        {
          columns: [
            {//Datos empresa
              width: 'auto',
              alignment: 'left',
              type: 'none',
              ul: [
                tipo,
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
                'Nº factura:0002-000000001',
                'Fecha: 06/12/2019',
                'CUIT/CUIL: xxxxxxxxxxxx',
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
    pdfMake.createPdf(facturaOriginal).download("factura");
  }

  generarNumero(){

  }
}
