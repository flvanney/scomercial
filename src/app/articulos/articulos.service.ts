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

  buscarArt(artId: string) {
    return this.http
      .get<Articulo>(`http://localhost:3000/articulos/${artId}`);
  }

  traerArticuloListener() {
    return this.articulosActualizados.asObservable();
  }

  guardarArt(data) {
    const nuevoArt = this.crearNuevoArt(data);

    this.http
      .post<Articulo>(`http://localhost:3000/articulos`, nuevoArt)
      .subscribe(() => {
        this.articulos.push(nuevoArt);
        this.articulosActualizados.next([... this.articulos]);
      });
  }

  actualizarArt(id, data) {
    data._id = id;
    const art = this.crearNuevoArt(data);
    this.http.put<Articulo>(`http://localhost:3000/articulos/${id}`, art);
  }

  crearNuevoArt(data) {
    let precios = [data.p1, data.p2, data.p3, data.p4];

    precios = precios.filter(el => {
      return el != null;
    })

    let id = data.hasOwnProperty('_id') ? data._id : null;

    const nuevoArt: Articulo = {
      _id: id,
      nombre: data.nombre,
      familia: data.familia,
      cantidad: data.cantidad,
      reservada: 0,
      habilitado: data.habilitado,
      precios: precios,
      descripcion: data.descripcion,
    };

    return nuevoArt;
  }


}
