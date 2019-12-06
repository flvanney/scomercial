import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Cliente } from '../clientes/cliente';
import { ClientesService } from '../clientes/clientes.service';
import { VentasService } from './venta.service';
import { Articulo } from '../articulos/articulo';
import { ArticulosService } from '../articulos/articulos.service';

import { formatCurrency } from '@angular/common';

@Component({
  selector: 'app-agregar-venta',
  templateUrl: './agregar-venta.component.html',
  styleUrls: ['./agregar-venta.component.css']
})
export class AgregarVentaComponent implements OnInit {
  clientes: Cliente[] = [];
  private clientesSub: Subscription;

  articulos: any[] = [];
  private articulosSub: Subscription;

  importeTotalSinIva = 0;
  importeTotalConIva = 0;
  ivaTotal = 0;

  ventaForm = this.fb.group({
    fecha: [this.getFechaHoy(), Validators.required],
    cliente: [null, Validators.required],
    ventas: this.fb.array([this.crearVenta()]),
    metodoDePago: [null, Validators.required],
    envio: ["1", Validators.required],
    desgravado: [0, Validators.required],
    observaciones: null,
    montoTotal: null
  });

  metodosDePago = ['Contado', 'Crédito', 'Tarjeta de crédito', 'Tarjeta de débito', 'Cheque'];

  constructor(
    private clientesService: ClientesService,
    private fb: FormBuilder,
    private ventasService: VentasService,
    private articulosService: ArticulosService,
    private snackBar: MatSnackBar
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

  cargarVenta() {
    this.ventaForm.value.montoTotal = this.calcularImporteTotal();
    if (this.ventaForm.invalid) {
      this.abrirSnackBar('Hay campos obligatorios sin completar o con errores', 'snack-roja');
    } else {
      this.abrirSnackBar('Venta registrada con éxito', 'snack-verde');
      this.ventasService.cargarVenta(this.ventaForm.value);
      this.ventaForm.reset({ fecha: this.getFechaHoy() });
    }
  }

  get traerVentas() {
    return this.ventaForm.get('ventas') as FormArray;
  }

  agregarFilaVenta() {
    this.traerVentas.push(this.crearVenta());
  }

  eliminarFilaVenta(i: number) {
    this.traerVentas.removeAt(i);
  }

  getFechaHoy() {
    return new Date().toISOString().substring(0, 10);
  }

  esRequerido(campo: string) {
    return this.ventaForm.controls[campo].hasError('required');
  }

  traerPrecios(i: number) {
    /* Si el usuario seleccionó un artículo se le devuelve la lista 
    de precios que le corresponde al mismo. Sino, una lista vacía. */

    const sinSeleccionar = this.ventaForm.value.ventas[i].articulo == null ? true : false;

    return sinSeleccionar ? [] : this.ventaForm.value.ventas[i].articulo.precios;
  }

  mayorANueve() {
    // Se usa para bloquear el botón de agregar ventas cuando éstas son más de 9.
    return this.traerVentas.controls.length > 9;
  }

  calcularImporte(i: number) {
    const venta = this.ventaForm.value.ventas[i];

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
    this.importeTotalSinIva = 0;
    this.ivaTotal = 0;

    this.ventaForm.value.ventas.forEach(fila => {
      let importeFilaSinIva = (fila.precio + fila.diferencia) * fila.cantidad;
      this.importeTotalSinIva += importeFilaSinIva;
      this.ivaTotal += (importeFilaSinIva * fila.articulo.iva / 100);
    });

    this.importeTotalConIva = this.importeTotalSinIva + this.ivaTotal;
    
    // Aplico el descuento a toda la venta
    this.importeTotalConIva -= (this.importeTotalConIva * this.ventaForm.value.desgravado / 100);

    return this.importeTotalConIva;
  }

  public formatearMoneda(monto: number) {
    return formatCurrency(monto, 'esAR', '$', 'ARS');
  }

  esConCredito() {
    return this.ventaForm.value.metodoDePago == "Crédito";
  }

  actualizarValidacionStock(i) {
    const stockArticulo = this.traerCampoArt(i, 'cantidad');
    const cantAVender = this.ventaForm.value.ventas[i].cantidad;

    const campoCant = this.ventaForm.controls.ventas['controls'][i]['controls'].cantidad;

    if (stockArticulo >= cantAVender) {
      campoCant.setErrors(null);
    } else {
      campoCant.setErrors({ 'invalid': true });
    }
  }

  traerCampoArt(i, campo) {
    if (this.ventaForm.value.ventas[i].articulo) {
      return this.ventaForm.value.ventas[i].articulo[campo];
    }
  }

  noHayStock(i) {
    return this.ventaForm.controls.ventas['controls'][i]['controls'].cantidad.status === "INVALID";
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
