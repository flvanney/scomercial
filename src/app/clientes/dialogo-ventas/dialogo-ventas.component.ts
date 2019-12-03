import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VentasService } from 'src/app/ventas/venta.service';
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
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DialogoVentasComponent>) {
    this.titulo = `Últimas compras de ${data.nombre} ${data.apellido}.`;
    this.dialogRef.updateSize('800vw', '800vw');
    this.ventasService.historialComprasCliente(data._id).subscribe(compras => {
      this.compras = compras;
    })
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

  sinCompras(): boolean {
    return Object.entries(this.compras).length === 0;
  }

  convertirStr(obj) {
    return JSON.stringify(obj);
  }

}
