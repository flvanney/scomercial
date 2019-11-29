import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Articulo } from './articulo';

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  private articulos: Articulo[] = [];
  private articulosActualizados = new Subject<Articulo[]>();

  constructor(private http: HttpClient) { }

  traerArticulos() {
    this.http
      .get<Articulo[]>(`http://localhost:3000/articulos`)
      .subscribe(respuesta => {
        this.articulos = respuesta;
        this.articulosActualizados.next([... this.articulos]);
      });
  }

  traerArticuloListener() {
    return this.articulosActualizados.asObservable();
  }

  cargarArt(data) {
    let precios = [data.p1, data.p2, data.p3, data.p4];

    precios = precios.filter(el => {
      return el != null;
    })

    const nuevoArt: Articulo = {
      nombre: data.nombre,
      familia: data.familia,
      cantidad: data.cantidad,
      reservada: 0,
      habilitado: true,
      precios: precios,
      descripcion: data.descripcion
    };

    this.http
      .post<Articulo>(`http://localhost:3000/articulos`, nuevoArt)
      .subscribe(respuesta => {
        this.articulos.push(nuevoArt);
        this.articulosActualizados.next([... this.articulos]);
      });

  }

}
