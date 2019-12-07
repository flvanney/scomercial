import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientesService } from '../clientes/clientes.service';
import { NotasService } from './notas.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cliente } from '../clientes/cliente';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css']
})
export class NotasComponent implements OnInit {

  clientes: Cliente[] = [];
  private clientesSub: Subscription;

  constructor(private clientesService: ClientesService,
    private notasService: NotasService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.clientesService.traerClientes();
    this.clientesSub = this.clientesService.traerClienteListener()
      .subscribe((clientes: Cliente[]) => {
        this.clientes = clientes;
      });
  }

  notaForm = this.fb.group({
    numero: [null, Validators.required],
    cliente: [null, Validators.required],
    tipoNota: ["D", Validators.required],
    monto: [null, Validators.required],
    fecha: [this.getFechaHoy(), Validators.required],
    motivo: null,
  });

  guardarNota() {
    if (this.notaForm.invalid) {
      this.abrirSnackBar('Complete todos los campos obligatorios.', 'snack-roja');
    } else {
      this.notasService.guardarNota(this.notaForm.value);
      this.abrirSnackBar('Nota guardada con éxito.', 'snack-verde');
      this.reiniciarForm();
      this.limpiarErroresForm();
    }
  }

  nombre(n, a) {
    return `${n} ${a}`;
  }

  reiniciarForm() {
    this.notaForm.reset({ fecha: this.getFechaHoy(), tipoNota: "D", pendiente: true });
  }

  limpiarErroresForm() {
    Object.keys(this.notaForm.controls).forEach(key => {
      this.notaForm.get(key).setErrors(null);
    });
  }

  esRequerido(campo: string) {
    return this.notaForm.controls[campo].hasError('required');
  }

  getFechaHoy() {
    return new Date().toISOString().substring(0, 10);
  }

  abrirSnackBar(msg: string, clase: string) {
    this.snackBar.open(msg, 'OK',
      {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: [clase]
      })
  }
}
