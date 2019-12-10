import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { formatCurrency } from '@angular/common';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { MatTableDataSource } from '@angular/material/table';

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

export class FacturaComponent {

  ventas: Venta[] = null;
  cargando: boolean;

  constructor(
    private articulosService: ArticulosService,
    private ventasService: VentasService,
    private clientesService: ClientesService
  ) { }

  displayedColumns = ['nombre', 'fecha', 'montoTotal', 'factura'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
    this.ventasService.traerVentas().subscribe((ventas: Venta[]) => {
      this.ventas = ventas;
      this.ventas.forEach(venta => {
        this.clientesService.buscarCliente(venta.cliente).subscribe((cliente: Cliente) => {
          venta.datosCliente = cliente;
        })
        venta.ventas.forEach(venta => {
          this.articulosService.buscarArt(venta.articulo).subscribe((art: Articulo) => {
            venta.datosArticulo = art;
          })
        })
      });
      this.dataSource = new MatTableDataSource(this.ventas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      console.log(this.ventas);
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getNombreCliente(venta) {
    if (typeof venta.datosCliente != 'undefined') {
      return `${venta.datosCliente.nombre} ${venta.datosCliente.apellido}`;
    }
  }

  generarFacturaB() {
    return this.facturado("Factura ORIGINAL", "B"), this.facturado("Factura COPIA", "B");
  }

  generarFacturaA() {
    return this.facturado("Factura ORIGINAL", "A"), this.facturado("Factura COPIA", "A");
  }

  formatearFecha(fechaChota) {
    const fecha = new Date(fechaChota);
    return `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}`;
  }

  public formatearMoneda(monto: number) {
    return formatCurrency(monto, 'esAR', '$', 'ARS');
  }

  verTipoFactura(venta) {
    return venta.datosCliente.tipoFactura === "B"
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
                'IVA Responsable Inscripto',]
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

  generarRemito() {
    return this.remitado('REMITO ORIGINAL'), this.remitado('REMITO COPIA'), this.remitado('REMITO COPIA')
  }


  remitado(tipo: String) {
    const remito = {
      pageSize: 'A4',
      content: [
        {//Letra de la factura
          text: "R",
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
                'IVA Responsable Inscripto',]
            },
            {
              width: '*',
              alignment: 'right',
              type: 'none',
              ul: [
                'Remito:0001-000000001',
                'Fecha: 06/12/2019',
                'CUIT/CUIL: xxxxxxxxxxxx',
                'Ingresos brutos: 0000000000',
                'Inicio de actividades: 01/01/2006']
            },]

        },

        {//Separador muy vago
          text: ' '
        },
        //Datos del cliente
        {
          columns: [
            {
              width: '*',
              alignment: 'left',
              type: 'none',
              ul: [
                'Señor: {nombre.cliente}',
                'Domicilio: {cliente.domicilio}',
                'Localidad: {clinete.localidad}']
            },
            {
              width: '*',
              alignment: 'right',
              type: 'none',
              ul: [
                'Condicion de IVA: {iva.cliente}',
                'CUIT: cliente.cuit',
                'Condicion de Pago: {formadepago}']
            }
          ]
        },
        {//Separador muy vago
          text: ' '
        },

        {
          table: {
            widths: [50, 'auto', '*'],
            body: [
              ['Cant', 'Cod', 'Descripcion'],
              ['5', 'man01', 'Manaos Uva'],
              ['1', 'EVA01', 'Kenji te vas a subir al Eva o no la concha de tu madre'],
            ]
          }
        },
        { text: ' ' },
        { text: ' ' },
        {
          type: 'none',
          ul: [
            'Lugar entrega:..............................................................................',
            'Fecha entrega:..............................................................................',
            'Forma envio:................................................................................',
          ],
        },
        { text: ' ' },
        {
          type: 'none',
          ul: [
            'DNI:.................................................................................................',
            'Firma y aclaracion: '
          ]
        }
      ],
      styles: {
        letraFactura: {
          bold: true,
          alignment: 'center',
          fontSize: 40,
        },
      }
    };
    pdfMake.createPdf(remito).download("remito");
  }
}
