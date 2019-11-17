import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pedido } from './pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private BASE_URL = `http://localhost:3000`;

  constructor(private http: HttpClient) { }

  traerPedidos() {
    // this.http.get()
  }

  cargarPedido(datos) {
    // TODO: generar nro de manera autoincremental.

    const nuevoPedido: Pedido = datos;
    this.http
      .post<Pedido>(`${this.BASE_URL}/pedidos`, nuevoPedido)
      .subscribe(res => {
        console.log(res);
      });
  }
}
