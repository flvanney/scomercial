import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VentasService } from 'src/app/ventas/venta.service';
import { ArticulosService } from 'src/app/articulos/articulos.service';
import { Articulo } from 'src/app/articulos/articulo';
import { Venta } from 'src/app/ventas/venta';

import { formatCurrency } from '@angular/common';

@Component({
  selector: 'app-dialogo-ventas',
  templateUrl: './dialogo-ventas.component.html',
  styleUrls: ['./dialogo-ventas.component.css']
})
export class DialogoVentasComponent {

  titulo: string;
  compras = {};

  constructor(
    private ventasService: VentasService,
    private articulosService: ArticulosService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DialogoVentasComponent>) {
    this.titulo = `Últimas compras de ${data.nombre} ${data.apellido}.`;
    this.dialogRef.updateSize('800vw', '800vw');
    this.ventasService.historialComprasCliente(data._id).subscribe((compras: Venta[]) => {

      // Todas las compras del cliente cuyo ID se pasó como parámetro.
      this.compras = compras;

      // Este doble for es para (en la venta) reemplazar el id del artículo por su nombre.
      for (let i = 0; i < compras.length; i++) {
        const ventas = compras[i].ventas;
        for (let j = 0; j < ventas.length; j++) {
          this.articulosService.buscarArt(ventas[j].articulo).subscribe((articulo: Articulo) => {
            ventas[j].articulo = articulo.nombre;
          })
        }
      }
    })
  }

  sinCompras(): boolean {
    return Object.entries(this.compras).length === 0;
  }

  formatearFecha(fechaChota) {
    const fecha = new Date(fechaChota);
    return `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}`;
  }

  redondear(cifra) {
    return Math.round(cifra * 100) / 100;
  }

  formatearMoneda(monto: number) {
    return formatCurrency(monto, 'esAR', '$', 'ARS');
  }

  formatearVenta(venta) {
    return `El ${this.formatearFecha(venta.fecha)} compró por un total de ${this.formatearMoneda(this.redondear(venta.montoTotal))}:`;
  }

  formatearFilaVenta(filaVenta) {
    return `${filaVenta.cantidad} ${filaVenta.cantidad > 1 ? 'unidades' : 'unidad'} de «${filaVenta.articulo}».`;
  }

}
