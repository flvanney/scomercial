import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClientesService } from '../clientes.service';
import { Cliente } from '../cliente';
import { Nota } from '../../notas/nota';
import { formatCurrency } from '@angular/common';

@Component({
  selector: 'app-dialogo-notas',
  templateUrl: './dialogo-notas.component.html',
  styleUrls: ['./dialogo-notas.component.css']
})
export class DialogoNotasComponent implements OnInit {

  cliente: Cliente;
  notas: Nota[] = [];

  constructor(private clientesService: ClientesService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DialogoNotasComponent>) {
    this.cliente = data;
  }

  ngOnInit() {
    this.clientesService.traerNotasCliente(this.cliente._id).subscribe((notas: Nota[]) => {
      this.notas = notas;
    })
  }

  getNombreCliente() {
    return `${this.cliente.nombre} ${this.cliente.apellido}`;
  }

  formatearTipoNota(tipo) {
    return tipo === "D" ? "débito" : "crédito";
  }

  formatearFecha(fechaChota) {
    const fecha = new Date(fechaChota);
    return `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}`;
  }

  sinNotas() {    
    return this.notas.length == 0;
  }

  formatearMoneda(monto: number) {
    return formatCurrency(monto, 'esAR', '$', 'ARS');
  }


}
