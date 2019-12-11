import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientesService } from '../clientes.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cliente } from '../cliente';

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
    dni: [null, Validators.required],
    cuit: null,
    cuil: null,
    tipoFactura: ["A", Validators.required],
    fechaDeInicio: null,
    estado: false,
    creditoMaximo: null,
    fechaDeActualizacion: null,
  });

  tieneDirAlt = false;
  provincias;

  modo: string;
  cliente: Cliente;
  private clienteId: string;

  constructor(
    private clientesService: ClientesService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.clientesService.traerProvincias();
    this.clientesService.traerProvinciasListener()
      .subscribe((provincias) => {
        this.provincias = provincias;
      })

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('clienteId')) {
        this.modo = 'editar';
        this.clienteId = paramMap.get('clienteId');
        this.clientesService.buscarCliente(this.clienteId).subscribe(cliente => {
          this.cliente = cliente;
          this.clienteForm.patchValue({
            organizacion: this.cliente.organizacion,
            nombre: this.cliente.nombre,
            apellido: this.cliente.apellido,
            provincia: this.cliente.provincia,
            ciudad: this.cliente.ciudad,
            direccion: this.cliente.direccion,
            direccionAlternativa: this.cliente.direccionAlternativa,
            factura: null,
            codigoPostal: this.cliente.codigoPostal,
            telefono: this.cliente.telefono,
            dni: this.cliente.dni,
            cuit: this.cliente.cuit,
            cuil: this.cliente.cuil,
            tipoFactura: this.cliente.tipoFactura,
            fechaDeInicio: this.cliente.fechaDeInicio,
            estado: this.cliente.cuenta.estado,
            creditoMaximo: this.cliente.cuenta.creditoMaximo,
            fechaDeActualizacion: this.cliente.cuenta.fechaDeActualizacion,
          })
        })
      } else {
        this.modo = 'crear';
        this.clienteId = null;
      }
    })
  }

  cargarCliente() {
    if (this.clienteForm.invalid) {
      this.abrirSnackBar('Complete todos los campos obligatorios.', 'snack-roja');
    }
    else if (this.modoEditar()) {
      this.clientesService.actualizarCliente(this.cliente._id, this.clienteForm.value);
      this.abrirSnackBar('Cliente modificado con éxito.', 'snack-verde');
    } else {
      this.clientesService.cargarCliente(this.clienteForm.value);
      this.abrirSnackBar('Cliente cargado con éxito.', 'snack-verde');
      this.reiniciarForm();
      this.limpiarErroresForm();
    }
  }

  reiniciarForm() {
    this.clienteForm.reset({ tipoFactura: "A" });
  }

  limpiarErroresForm() {
    Object.keys(this.clienteForm.controls).forEach(key => {
      this.clienteForm.get(key).setErrors(null);
    });
  }

  modoEditar(): boolean {
    return this.modo == 'editar';
  }

  esRequerido(campo: string) {
    return this.clienteForm.controls[campo].hasError('required');
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
