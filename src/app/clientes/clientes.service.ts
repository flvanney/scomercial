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

  cargarCliente(datos) {
    let nuevaCuenta: Cuenta;
    if (datos.fechaDeActualizacion != null && datos.creditoMaximo != null) {
      nuevaCuenta = {
        estado: true,
        fechaDeActualizacion: datos.fechaDeActualizacion,
        saldoGastado: 0,
        creditoMaximo: datos.creditoMaximo
      }
    } else {
      nuevaCuenta = {
        estado: false,
        fechaDeActualizacion: null,
        saldoGastado: 0,
        creditoMaximo: 0
      }
    }

    const nuevoCliente: Cliente = {
      _id: null,
      nombre: datos.nombre,
      apellido: datos.apellido,
      organizacion: datos.organizacion,
      direccion: datos.direccion,
      direccionAlternativa: datos.direccionAlternativa,
      provincia: datos.provincia,
      ciudad: datos.ciudad,
      codigoPostal: datos.codigoPostal,
      telefono: datos.telefono,
      cuit: datos.cuit,
      cuil: datos.cuil,
      fechaDeInicio: datos.fechaDeInicio,
      cuenta: nuevaCuenta,
    }

    this.http
      .post<Cliente>(`${this.BASE_URL}/clientes`, nuevoCliente)
      .subscribe(respuesta => {
        const id = respuesta._id;
        nuevoCliente._id = id;
        this.clientes.push(nuevoCliente);
        this.clientesActualizados.next([... this.clientes]);
      });

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
