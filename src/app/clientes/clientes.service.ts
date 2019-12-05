import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Cliente, Provincia, Cuenta } from './cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private BASE_URL = `http://localhost:3000`;

  private PROVINCIAS_URL = `https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre`;

  private clientes: Cliente[] = [];
  private clientesActualizados = new Subject<Cliente[]>();

  private provincias: Provincia[];
  private provinciasActualizadas = new Subject<Provincia[]>();

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

  traerProvinciasListener() {
    return this.provinciasActualizadas.asObservable();
  }

  buscarCliente(clienteId: string) {
    return this.http.get<Cliente>(`${this.BASE_URL}/clientes/${clienteId}`);
  }

  cargarCliente(data) {
    const nuevoCliente: Cliente = this.crearNuevoCliente(data);

    this.http
      .post<Cliente>(`${this.BASE_URL}/clientes`, nuevoCliente)
      .subscribe(respuesta => {
        const id = respuesta._id;
        nuevoCliente._id = id;
        this.clientes.push(nuevoCliente);
        this.clientesActualizados.next([... this.clientes]);
      });
  }

  actualizarCliente(clienteId, data) {
    data._id = clienteId;
    const clienteActualizado: Cliente = this.crearNuevoCliente(data);
    console.log(`Cliente creado de nuevo: ${JSON.stringify(clienteActualizado)}`);

    this.http
      .put<Cliente>(`${this.BASE_URL}/clientes/${clienteId}`, clienteActualizado)
      .subscribe(res => {
        const nuevoArrClientes = [... this.clientes];
        const indiceClienteDesactualizado = nuevoArrClientes.findIndex(c => c._id === clienteActualizado._id);
        nuevoArrClientes[indiceClienteDesactualizado] = clienteActualizado;
        this.clientes = nuevoArrClientes;
        this.clientesActualizados.next([... this.clientes]);
      })
  }

  crearNuevoCliente(data): Cliente {
    let nuevaCuenta: Cuenta;
    if (data.estado == true && data.fechaDeActualizacion != null && data.creditoMaximo != null) {
      // Solamente creo la cuenta cuando le pasan los 3 datos.
      nuevaCuenta = {
        estado: true,
        fechaDeActualizacion: data.fechaDeActualizacion,
        saldoGastado: 0,
        creditoMaximo: data.creditoMaximo
      }
    } else {
      nuevaCuenta = {
        estado: false,
        fechaDeActualizacion: null,
        saldoGastado: 0,
        creditoMaximo: 0
      }
    }

    let id = data.hasOwnProperty('_id') ? data._id : null;

    const nuevoCliente: Cliente = {
      _id: id,
      nombre: data.nombre,
      apellido: data.apellido,
      organizacion: data.organizacion,
      direccion: data.direccion,
      direccionAlternativa: data.direccionAlternativa,
      provincia: data.provincia,
      ciudad: data.ciudad,
      codigoPostal: data.codigoPostal,
      telefono: data.telefono,
      cuit: data.cuit,
      cuil: data.cuil,
      fechaDeInicio: data.fechaDeInicio,
      cuenta: nuevaCuenta,
    }

    return nuevoCliente;
  }

  traerProvincias() {
    this.http
      .get<{ provincias: any }>(this.PROVINCIAS_URL)
      .pipe(map((data) => {
        return data.provincias.map(provincia => {
          return {
            nombre: provincia.nombre
          };
        });
      }))
      .subscribe((respuesta) => {
        this.provincias = respuesta;
        this.provinciasActualizadas.next([... this.provincias]);
      });
  }

}
