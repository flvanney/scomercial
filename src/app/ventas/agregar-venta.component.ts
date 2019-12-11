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
    vendedor: [null, Validators.required],
    ventas: this.fb.array([this.crearVenta()]),
    metodoDePago: [null, Validators.required],
    envio: ["0", Validators.required],
    direccionEnvio: null,
    formaEnvio: null,
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
    this.traerClientes();
    this.traerArticulos();
  }

  traerClientes() {
    this.clientesService.traerClientes();
    this.clientesSub = this.clientesService.traerClienteListener()
      .subscribe((clientes: Cliente[]) => {
        this.clientes = clientes;
      });
  }

  traerArticulos() {
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
      precio: [null, [Validators.required, Validators.min(1)]],
      diferencia: 0,
      totalFilaSinIva: null,
    });
  }

  cargarVenta() {
    this.ventaForm.value.montoTotal = this.importeTotalConIva;
    if (this.ventaForm.invalid) {
      this.abrirSnackBar('Hay campos obligatorios sin completar o con errores', 'snack-roja');
    } else if (this.esConCredito() && !this.tieneGuita()) {
      this.abrirSnackBar('El crédito del cliente no es lo suficientemente amplio para realizar esta compra', 'snack-roja');
    } else if (this.esConCredito() && !this.esCliente()) {
      this.abrirSnackBar('El cliente no tiene una cuenta corriente habilitada', 'snack-roja');
    } else {
      this.abrirSnackBar('Venta registrada con éxito', 'snack-verde');
      this.articulosService.actualizarStock(this.ventaForm.value);
      this.calcularTotalesFila();
      this.ventasService.cargarVenta(this.ventaForm.value);
      this.ventaForm.reset({ fecha: this.getFechaHoy(), envio: "0" });
      this.limpiarErroresForm();
    }
  }

  calcularTotalesFila() {
    this.ventaForm.value.ventas.forEach((venta, index) => {
      venta.totalFilaSinIva = this.calcularImporte(index);
    })
  }

  limpiarErroresForm() {
    Object.keys(this.ventaForm.controls).forEach(key => {
      this.ventaForm.get(key).setErrors(null);
    });

    for (let i = 0; i < this.ventaForm.controls.ventas['controls'].length; i++) {
      let controls = this.ventaForm.controls.ventas['controls'][i]['controls'];
      Object.keys(controls).forEach(key => {
        controls[key].setErrors(null);
      })
    }
  }

  getGuitaCliente() {
    if (this.elClienteFueSeleccionado()) {
      const cliente = this.buscarCliente(this.ventaForm.value.cliente);
      const guitaCliente = cliente.cuenta.creditoMaximo - cliente.cuenta.saldoGastado;
      return guitaCliente;
    }
  }

  buscarCliente(idCliente): Cliente {
    return this.clientes.find(cliente => cliente._id === idCliente);
  }

  tieneGuita() {
    if (this.elClienteFueSeleccionado()) {
      return this.getGuitaCliente() + 10 >= this.importeTotalConIva;
    }
  }

  elClienteFueSeleccionado() {
    return this.ventaForm.value.cliente != null;
  }

  esConCredito() {
    return this.ventaForm.value.metodoDePago == "Crédito";
  }

  ventasIncompletas() {
    return this.ventaForm.controls.ventas.status === "INVALID";
  }

  esCliente() {
    const cliente = this.buscarCliente(this.ventaForm.value.cliente);
    return cliente.cuenta.estado === true;
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
      return importe;
    }
    return '';
  }

  calcularImporteTotal() {
    this.importeTotalSinIva = 0;
    this.ivaTotal = 0;

    this.ventaForm.value.ventas.forEach(fila => {
      if (fila.articulo != null && fila.precio != null && fila.cantidad != null) {
        let importeFilaSinIva = (fila.precio + fila.diferencia) * fila.cantidad;
        this.importeTotalSinIva += importeFilaSinIva;
        this.ivaTotal += (importeFilaSinIva * fila.articulo.iva / 100);
      }
    });

    this.importeTotalConIva = this.importeTotalSinIva + this.ivaTotal;

    // Aplico el descuento a toda la venta
    if (this.ventaForm.value.desgravado != null) {
      this.importeTotalConIva -= (this.importeTotalConIva * this.ventaForm.value.desgravado / 100);
    }
    return this.importeTotalConIva;
  }

  public formatearMoneda(monto: number) {
    return formatCurrency(monto, 'esAR', '$', 'ARS');
  }

  actualizarValidacionStock(i) {
    const stockArticulo = this.traerCampoArt(i, 'cantidad');
    const cantAVender = this.ventaForm.value.ventas[i].cantidad;

    const campoCant = this.ventaForm.controls.ventas['controls'][i]['controls'].cantidad;

    if (stockArticulo >= cantAVender) {
      campoCant.setErrors(null);
      this.calcularImporteTotal();
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

  esConEnvio() {
    return this.ventaForm.value.envio == "1";
  }

  getDireccionCliente() {
    if (this.ventaForm.value.cliente !== null) {
      const cliente = this.buscarCliente(this.ventaForm.value.cliente);
      return cliente.direccion;
    } else {
      return null;
    }
  }
}
