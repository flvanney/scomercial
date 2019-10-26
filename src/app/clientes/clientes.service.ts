import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Cliente } from './cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private BASE_URL = `http://localhost:3000`;

  private clientes: Cliente[];
  private clientesActualizados = new Subject<Cliente[]>();

  constructor(private http: HttpClient) { }

  traerClientes() {
    this.http
      .get<Cliente[]>(`${this.BASE_URL}/clientes`)
      .subscribe(respuesta => {
        this.clientes = respuesta;
        this.clientesActualizados.next([... this.clientes]);
      });
  }

  traerClienteListener() {
    return this.clientesActualizados.asObservable();
  }

  cargarCliente(datosNuevoCliente) {
    const nuevoCliente: Cliente = datosNuevoCliente;
    this.http.post<Cliente>(`${this.BASE_URL}/clientes`, nuevoCliente)
      .subscribe(respuesta => {
        const id = respuesta._id;
        nuevoCliente._id = id;
        this.clientes.push(nuevoCliente);
        this.clientesActualizados.next([... this.clientes]);
        console.log(`Se cargó con éxito el cliente ${nuevoCliente.nombre}`);
      });
  }

}
