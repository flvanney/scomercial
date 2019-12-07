import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../clientes/cliente';

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
    // Cargar venta
    this.traerUltimaVenta().subscribe(venta => {
      venta == null ? datos.nro = 1 : datos.nro = venta['nro'] + 1;
      this.http
        .post(`${this.BASE_URL}/ventas`, datos)
        .subscribe();
    });

    // Actualizar estado de la cuenta si compró con crédito    
    if (datos.metodoDePago === "Crédito") {
      this.http
        .put<Cliente>(`http://localhost:3000/clientes/actualizar-cuenta/${datos.cliente}`,
          { cuenta: { saldoGastado: datos.montoTotal } })
        .subscribe();
    }

  }

  historialComprasCliente(idCliente: string) {
    return this.http.get(`${this.BASE_URL}/ventas/${idCliente}`);
  }
}
