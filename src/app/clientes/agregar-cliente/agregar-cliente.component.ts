import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientesService } from '../clientes.service';

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
    factura: [null, Validators.required],
    codigoPostal: [null, Validators.compose([
      Validators.required, Validators.minLength(5), Validators.maxLength(5)])
    ],
  });

  tieneDirAlt = false;

  provincias;

  constructor(
    private clientesService: ClientesService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.clientesService.traerProvincias();
    this.clientesService.traerProvinciasListener()
      .subscribe((provincias) => {
        this.provincias = provincias;
      });
  }

  cargarCliente() {
    this.clientesService.cargarCliente(this.clienteForm.value);
  }

  esRequerido(campo: string) {
    return this.clienteForm.controls[campo].hasError('required');
  }

}
