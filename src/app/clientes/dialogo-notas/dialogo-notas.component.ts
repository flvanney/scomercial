import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClientesService } from '../clientes.service';
import { Cliente } from '../cliente';
import { Nota } from '../../notas/nota';

@Component({
  selector: 'app-dialogo-notas',
  templateUrl: './dialogo-notas.component.html',
  styleUrls: ['./dialogo-notas.component.css']
})
export class DialogoNotasComponent implements OnInit {

  cliente: Cliente = null;
  notas: Nota = null;

  constructor(private clientesService: ClientesService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DialogoNotasComponent>) {
    this.cliente = data;
  }

  ngOnInit() {
    this.clientesService.traerNotasCliente(this.cliente._id).subscribe((notas: Nota) => {
      console.log(notas);
      
      this.notas = notas;
    })
  }

  str(notas) {
    console.log('STR: ' + this.notas);
    return JSON.stringify(notas);
  }



}
