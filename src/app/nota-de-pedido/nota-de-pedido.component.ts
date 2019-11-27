import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators, FormGroup, AbstractControl, FormArray, FormControl } from '@angular/forms';

import { Cliente } from '../clientes/cliente';
import { ClientesService } from '../clientes/clientes.service';
import { PedidosService } from './pedidos.service';
import { Articulo } from '../articulo';
import { ArticulosService } from '../articulos.service';

import { formatCurrency } from '@angular/common';

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

  importeTotal = 0;

  pedidoForm = this.fb.group({
    nro: null,
    fecha: [this.getFechaHoy(), Validators.required],
    cliente: [null, Validators.required],
    ventas: this.fb.array([this.crearVenta()], [this.validarVenta]),
    metodopago: [null, Validators.required],
    envio: [null, Validators.required],
    observaciones: null
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
      .subscribe((articulos: Articulo[]) => {
        this.articulos = articulos;
      });
  }

  crearVenta(): FormGroup {
    return this.fb.group({
      articulo: [null, [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(1)]],
      diferencia: 0,
    });
  }

  cargarPedido() {
    this.pedidosService.cargarPedido(this.pedidoForm.value);
    this.pedidoForm.reset({ fecha: this.getFechaHoy() })
  }

  get traerVentas() {
    return this.pedidoForm.get('ventas') as FormArray;
  }

  agregarFilaVenta() {
    this.traerVentas.push(this.crearVenta());
  }

  eliminarFilaVenta(i: number) {
    this.traerVentas.removeAt(i);
  }

  validarVenta(control: AbstractControl): { [key: string]: boolean | null } {
    // TODO
    // El stock no reservado debe ser mayor a la cantidad que se va a comprar
    const invalid = control.value < 0;
    return invalid ? { ventaInvalid: true } : null;
  }

  getFechaHoy() {
    return new Date().toISOString().substring(0, 10);
  }

  esRequerido(campo: string) {
    return this.pedidoForm.controls[campo].hasError('required');
  }

  traerPrecios(i: number) {
    /* Si el usuario seleccionó un artículo se le devuelve la lista 
    de precios que le corresponde al mismo. Sino, una lista vacía. */

    const sinSeleccionar = this.pedidoForm.value.ventas[i].articulo == null ? true : false;

    return sinSeleccionar ? [] : this.pedidoForm.value.ventas[i].articulo.precios;
  }

  mayorANueve() {
    // Se usa para bloquear el botón de agregar 
    // ventas cuando éstas son más de 9.
    return this.traerVentas.controls.length > 9;
  }

  calcularImporte(i: number) {
    /* El importe es el producto entre el precio de lista seleccionado
    y la cantidad de artículos. */

    const venta = this.pedidoForm.value.ventas[i];

    if (venta != undefined) {
      const cantidad = venta.cantidad == null ? 0 : venta.cantidad;
      const precio = venta.precio == null ? 0 : venta.precio;
      const diferencia = venta.diferencia == null ? 0 : venta.diferencia;
      const importe = (precio + diferencia) * cantidad;
      return this.formatearMoneda(importe);
    }
    return '';
  }

  calcularImporteTotal() {
    this.pedidoForm.value.ventas.forEach(venta => {
      this.importeTotal += (venta.precio + venta.diferencia) * venta.cantidad;
    });
    return this.importeTotal;
  }

  public formatearMoneda(monto: number) {
    return formatCurrency(monto, 'esAR', '$', 'ARS');
  }

}
