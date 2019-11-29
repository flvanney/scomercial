import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private BASE_URL = `http://localhost:3000`;

  constructor(private http: HttpClient) {
  }

  traerPedidos() {
    // this.http.get()
  }

  traerUltimoPedido() {
    return this.http.get(`${this.BASE_URL}/pedidos/ult`);
  }

  cargarPedido(datos) {
    datos.ventas.forEach(fila => {
      fila.articulo = fila.articulo._id;
      fila.precio += fila.diferencia;
    });

    this.traerUltimoPedido().subscribe(pedido => {
      pedido == null ? datos.nro = 1 : datos.nro = pedido['nro'] + 1;
      this.http
        .post(`${this.BASE_URL}/pedidos`, datos)
        .subscribe(res => {
          console.log(res);
        });
    });
  }
}
