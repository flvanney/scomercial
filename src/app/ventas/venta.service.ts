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
    // this.http.get()
  }

  traerUltimaVenta() {
    return this.http.get(`${this.BASE_URL}/ventas/ult`);
  }

  cargarVenta(datos) {
    datos.ventas.forEach(fila => {
      fila.articulo = fila.articulo._id;
      fila.precio += fila.diferencia;
    });

    this.traerUltimaVenta().subscribe(venta => {
      venta == null ? datos.nro = 1 : datos.nro = venta['nro'] + 1;
      this.http
        .post(`${this.BASE_URL}/ventas`, datos)
        .subscribe(res => {
          console.log(res);
        });
    });
  }
}
