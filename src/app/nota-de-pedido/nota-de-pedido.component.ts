import { Component, OnInit } from '@angular/core';
import { Cliente } from '../clientes/cliente';
import { ClientesService } from '../clientes/clientes.service';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-nota-de-pedido',
  templateUrl: './nota-de-pedido.component.html',
  styleUrls: ['./nota-de-pedido.component.css']
})
export class NotaDePedidoComponent implements OnInit {
  clientes: Cliente[] = [];
  private clientesSub: Subscription;

  pedidoForm = this.fb.group({
    nro: ['00000001', Validators.required],
    fecha: [null, Validators.required],
    solicitante: [null, Validators.required],
    metodopago: [null, Validators.required],
    envio: null,
    observaciones: null,
  });

  metodosDePago = ['Contado', 'Tarjeta de crédito', 'Tarjeta de débito', 'Cheque'];

  constructor(
    private clientesService: ClientesService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.clientesService.traerClientes();
    this.clientesSub = this.clientesService.traerClienteListener()
      .subscribe((clientes: Cliente[]) => {
        this.clientes = clientes;
      });
  }

  cargarNotaDePedido() {
    console.log(`Llamada a cargarNotaDePedido()`);
  }

  esRequerido(campo: string) {
    return this.pedidoForm.controls[campo].hasError('required');
  }

}
