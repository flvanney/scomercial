import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientesService } from '../clientes.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.css']
})
export class AgregarClienteComponent implements OnInit {

  clienteForm = this.fb.group({
    organizacion: null,
    nombre: [null, Validators.required],
    apellido: [null, Validators.required],
    provincia: [null, Validators.required],
    ciudad: [null, Validators.required],
    direccion: [null, Validators.required],
    direccionAlternativa: null,
    factura: null,
    codigoPostal: [null, Validators.required],
    telefono: null,
    cuit: null,
    cuil: null,
    fechaDeInicio: null,
    estado: false,
    creditoMaximo: null,
    fechaDeActualizacion: null,
  });

  tieneDirAlt = false;

  provincias;

  constructor(
    private clientesService: ClientesService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.clientesService.traerProvincias();
    this.clientesService.traerProvinciasListener()
      .subscribe((provincias) => {
        this.provincias = provincias;
      });
  }

  cargarCliente() {

    if (this.clienteForm.invalid) {
      this.abrirSnackBar('Complete todos los campos obligatorios.', 'OK', 'snack-roja');
    }
    /*
    else if (this.modoEditar()) {
      this.clientesService.actualizarArt(this.articulo._id, this.artForm.value);
      this.abrirSnackBar('Artículo modificado con éxito.', 'OK', 'snack-verde');
    
  } */ else {
      this.clientesService.cargarCliente(this.clienteForm.value);
      this.abrirSnackBar('Cliente cargado con éxito.', 'OK', 'snack-verde');
      this.reiniciarForm();
      this.limpiarErroresForm();
    }
  }

  reiniciarForm() {
    this.clienteForm.reset();
  }

  limpiarErroresForm() {
    Object.keys(this.clienteForm.controls).forEach(key => {
      this.clienteForm.get(key).setErrors(null);
    });
  }


  esRequerido(campo: string) {
    return this.clienteForm.controls[campo].hasError('required');
  }

  getFechaHoy() {
    return new Date().toISOString().substring(0, 10);
  }

  abrirSnackBar(msg: string, accion: string, clase: string) {
    this.snackBar.open(msg, accion,
      {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: [clase]
      })
  }
}
