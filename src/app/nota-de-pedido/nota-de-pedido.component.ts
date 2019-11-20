import { Component, OnInit } from '@angular/core';
import { Cliente } from '../clientes/cliente';
import { ClientesService } from '../clientes/clientes.service';
import { PedidosService } from './pedidos.service';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { ArticulosService } from '../articulos.service';
import { Articulo } from '../articulo';

@Component({
  selector: 'app-nota-de-pedido',
  templateUrl: './nota-de-pedido.component.html',
  styleUrls: ['./nota-de-pedido.component.css']
})
export class NotaDePedidoComponent implements OnInit {
  clientes: Cliente[] = [];
  private clientesSub: Subscription;

  articulos: any[] = [];
  private articulosSub: Subscription;

  pedidoForm = this.fb.group({
    fecha: [this.getFechaHoy(), Validators.required],
    solicitante: [null, Validators.required],
    articulo: [null, Validators.required],
    metodopago: [null, Validators.required],
    envio: null,
    observaciones: null,
  });

  metodosDePago = ['Contado', 'Tarjeta de crédito', 'Tarjeta de débito', 'Cheque'];

  constructor(
    private clientesService: ClientesService,
    private fb: FormBuilder,
    private pedidosService: PedidosService,
    private articulosService: ArticulosService
  ) { }

  ngOnInit() {
    this.clientesService.traerClientes();
    this.clientesSub = this.clientesService.traerClienteListener()
      .subscribe((clientes: Cliente[]) => {
        this.clientes = clientes;
      });

    this.articulosService.traerArticulos();
    this.articulosService.traerArticuloListener()
      .subscribe((articulos: any[]) => {
        this.articulos = articulos;
      });

  }

  getFechaHoy() {
    return new Date().toISOString().substring(0, 10);
  }

  cargarPedido() {
    this.pedidosService.cargarPedido(this.pedidoForm.value);
  }

  esRequerido(campo: string) {
    return this.pedidoForm.controls[campo].hasError('required');
  }

}
