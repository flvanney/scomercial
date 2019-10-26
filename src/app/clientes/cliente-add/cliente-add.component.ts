import { Component, OnInit } from '@angular/core';

import { ClientesService } from '../clientes.service';

import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-cliente-add',
  templateUrl: './cliente-add.component.html',
  styleUrls: ['./cliente-add.component.css']
})
export class ClienteAddComponent implements OnInit {

  clienteForm: FormGroup;

  constructor(
    private clientesService: ClientesService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.clienteForm = this.fb.group({
      nombre: [''],
      dni: [''],
      tipo: [''],
    });
  }

  cargarCliente() {
    this.clientesService.cargarCliente(this.clienteForm.value);
  }

}
