import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VentasService } from 'src/app/ventas/venta.service';
import { ArticulosService } from 'src/app/articulos/articulos.service';
import { Articulo } from 'src/app/articulos/articulo';
import { Venta } from 'src/app/ventas/venta';

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
      this.compras = compras;

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

  formatearVenta(venta) {
    return `El ${this.formatearFecha(venta.fecha)} compró por un total de \$${JSON.stringify(venta.montoTotal)}:`;
  }

  formatearFilaVenta(filaVenta) {
    return `${filaVenta.cantidad} ${filaVenta.cantidad > 1 ? 'unidades' : 'unidad'} de «${filaVenta.articulo}».`;
  }

}
