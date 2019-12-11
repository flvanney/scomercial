import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { formatCurrency } from '@angular/common';

import * as numerosletras from 'numeros_a_letras';
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

  constructor(
    private articulosService: ArticulosService,
    private ventasService: VentasService,
    private clientesService: ClientesService
  ) { }

  displayedColumns = ['nombre', 'fecha', 'montoTotal', 'factura', 'remito'];
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

  generarFactura(venta: Venta, tipoFactura: String) {
    return this.facturado("Factura ORIGINAL", tipoFactura, "Factura ORIGINAL", venta), this.facturado("Factura COPIA", "B", "Factura DUPLICADA", venta);
  }

  getFechaHoy() {
    return new Date().toISOString().substring(0, 10);
  }

  formatearFecha(fechaChota) {
    const fecha = new Date(fechaChota);
    return `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}`;
  }

  formatearMoneda(monto: number) {
    return formatCurrency(monto, 'esAR', '$', 'ARS');
  }

  verTipoFactura(venta: Venta) {
    if (typeof venta.datosCliente != "undefined") {
      return venta.datosCliente.tipoFactura === "B";
    }
  }

  esConEnvio(venta: Venta) {
    if (typeof venta != "undefined") {
      return venta.envio;
    }
  }

  facturado(tipo: String, letra: String, nombreArchivo: string, venta: Venta) {
    let fecha = this.getFechaHoy();
    let IVACliente = "Responsable Inscripto";
    let total = numerosletras(venta.montoTotal, 'nominal', 2, 'CENTAVOS');
    if (letra === "B") {
      IVACliente = "Consumidor Final";
    }
    //fecha= this.formatearFecha(fecha);
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
                'Razon social: ' + venta.datosCliente.nombre + ' ' + venta.datosCliente.apellido,
                'Domicilio: ' + venta.datosCliente.direccion,
                'Localidad: ' + venta.datosCliente.provincia + ', ' + venta.datosCliente.ciudad,
                'Condicion de venta: ' + venta.metodoDePago,]
            },
            {
              style: 'datosComprador',
              width: '*',
              alignment: 'right',
              type: 'none',
              ul: [
                'Telefono: ' + venta.datosCliente.telefono,
                'Fecha: ' + fecha,
                'DNI: ' + venta.datosCliente.dni,
                'Condicion de IVA: ' + IVACliente,]
            },]
        },
        {//Separador muy vago
          text: ' '
        },

        this.getTablaFactura(venta),

        {//Separador muy vago
          text: ' '
        },

        {
          alignment: 'right',
          text: 'Importe total: ' + this.formatearMoneda(venta.montoTotal),
        },

        {//Separador muy vago
          text: ' '
        },

        {//Esto va a ser un dolor de huevos...
          text: 'Son Pesos ' + total,
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
    pdfMake.createPdf(facturaOriginal).download(nombreArchivo);
  }

  generarRemito(venta: Venta) {
    return this.remitado('REMITO ORIGINAL', 'REMITO ORIGINAL', venta), this.remitado('REMITO COPIA', 'REMITO DUPLICADO', venta), this.remitado('REMITO COPIA', 'REMITO TRIPLICADO', venta);
  }

  remitado(tipo: String, nombreArchivo: String, venta: Venta) {
    let fecha = this.getFechaHoy();
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
                'Tel: 2477-412345',
                'IVA Responsable Inscripto',]
            },
            {
              width: '*',
              alignment: 'right',
              type: 'none',
              ul: [
                'Remito:0001-000000001',
                'Fecha: ' + fecha,
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
                'Señor: ' + venta.datosCliente.nombre + ' ' + venta.datosCliente.apellido,
                'Domicilio: ' + venta.datosCliente.direccion,
                'Localidad: ' + venta.datosCliente.provincia + ', ' + venta.datosCliente.ciudad]
            },
            {
              width: '*',
              alignment: 'right',
              type: 'none',
              ul: [
                'Condicion de IVA: Responsable Inscripto',
                'CUIT: ' + venta.datosCliente.cuil,
                'Condicion de Pago: ' + venta.metodoDePago]
            }
          ]
        },
        {//Separador muy vago
          text: ' '
        },

        this.getTablaRemito(venta),

        { text: ' ' },
        { text: ' ' },
        {
          type: 'none',
          ul: [
            'Lugar entrega: ' + venta.direccionEnvio,
            'Fecha entrega:..............................................................................',
            'Forma envio: ' + venta.formaEnvio,
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
    pdfMake.createPdf(remito).download(nombreArchivo);
  }

  getTablaFactura(venta: Venta) {
    let articulos = venta.ventas;

    return {
      table: {
        widths: ['auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto'],
        body: [
          [
            { text: 'Cód.' },
            { text: 'Nombre' },
            { text: 'Cant.' },
            { text: 'Descripción' },
            { text: 'P.U.' },
            { text: 'IVA' },
            { text: 'Importe' }
          ],
          ...articulos.map(art => {
            return [
              art.datosArticulo.codigo,
              art.datosArticulo.nombre,
              art.cantidad,
              art.datosArticulo.descripcion,
              this.formatearMoneda(art.precio),
              art.datosArticulo.iva + '%',
              this.formatearMoneda(art.totalFilaSinIva)];
          })
        ]
      }
    }
  }

  getTablaRemito(venta: Venta) {
    let articulos = venta.ventas;
    return {
      table: {
        widths: ['auto', 'auto', '*'],
        body: [
          [{
            text: 'Cant.',
          },
          {
            text: 'Nombre',
          },
          {
            text: 'Descripción',
          },
          ],
          ...articulos.map(art => {
            return [art.cantidad, art.datosArticulo.nombre, art.datosArticulo.descripcion];
          })
        ]
      }
    }
  }
}
