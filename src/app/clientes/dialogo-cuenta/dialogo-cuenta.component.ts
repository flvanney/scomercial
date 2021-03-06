import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClientesService } from '../clientes.service';
import { Cliente } from '../cliente';

@Component({
  selector: 'app-dialogo-cuenta',
  templateUrl: './dialogo-cuenta.component.html',
  styleUrls: ['./dialogo-cuenta.component.css']
})
export class DialogoCuentaComponent {

  cliente: Cliente = null;

  constructor(
    private clientesService: ClientesService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DialogoCuentaComponent>) {
    this.cliente = data;
  }

  nombre() {
    return `${this.cliente.nombre} ${this.cliente.apellido}`;
  }

  sinCuenta() {
    return !this.cliente.cuenta.estado;
  }

  formatearFecha(fechaChota) {
    const fecha = new Date(fechaChota);
    return `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}`;
  }

  getSaldoGastado() {
    return Math.round(this.cliente.cuenta.saldoGastado * 100) / 100;
  }

  getSaldoGastadoSinNotas() {
    const saldoGastado = Math.round(this.cliente.cuenta.saldoGastado * 100) / 100;
    if (saldoGastado > 0) {
      return saldoGastado;
    } else {
      return 0;
    }
  }

  getCreditoMaximo() {
    return this.cliente.cuenta.creditoMaximo;
  }

  getSaldoDisponible() {
    return Math.round((this.getCreditoMaximo() - this.getSaldoGastado()) * 100)/100;
  }


}
