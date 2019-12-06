import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private BASE_URL = `http://localhost:3000`;

  constructor(private http: HttpClient) {
  }

  traerVentas() {
    this.http.get(`${this.BASE_URL}/ventas`);
  }

  traerUltimaVenta() {
    return this.http.get(`${this.BASE_URL}/ventas/ult`);
  }

  cargarVenta(datos) {
    datos.ventas.forEach(fila => {
      const id = fila.articulo._id;
      fila.articulo = id;
      fila.precio += fila.diferencia;
      delete fila.diferencia;

      this.http
        .put(`${this.BASE_URL}/articulos/actualizar-stock/${id}`, { cantidad: fila.cantidad })
        .subscribe();
    });

    this.traerUltimaVenta().subscribe(venta => {
      venta == null ? datos.nro = 1 : datos.nro = venta['nro'] + 1;
      this.http
        .post(`${this.BASE_URL}/ventas`, datos)
        .subscribe();
    });
  }

  historialComprasCliente(idCliente: string) {
    return this.http.get(`${this.BASE_URL}/ventas/${idCliente}`);
  }
}
