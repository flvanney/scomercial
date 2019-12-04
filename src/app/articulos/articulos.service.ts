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

  buscarArtLocal(artId: string) {
    const i = this.articulos.findIndex(a => a._id === artId);
    return this.articulos[i];
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
    console.log('Entramos a actualizarArt');
    
    data._id = id;
    const art: Articulo = this.crearNuevoArt(data);

    this.http
      .put<Articulo>(`http://localhost:3000/articulos/${id}`, art)
      .subscribe(res => {
        console.log(`Subscribe del put de articulos, ${this.articulos}`);
        const nuevoArrArticulos = [...this.articulos];
        const indiceArtDesactualizado = nuevoArrArticulos.findIndex(a => a._id === art._id);
        nuevoArrArticulos[indiceArtDesactualizado] = art;
        this.articulos = nuevoArrArticulos;
        this.articulosActualizados.next([...this.articulos]);
        console.log(`Subscribe del put de articulos, ${this.articulos}`);
      });
  }

  crearNuevoArt(data) {
    let precios = [data.p1, data.p2, data.p3, data.p4];

    precios = precios.filter(el => {
      return el != null;
    })

    let id = data.hasOwnProperty('_id') ? data._id : null;

    const nuevoArt: Articulo = {
      _id: id,
      codigo: data.codigo,
      nombre: data.nombre,
      marca: data.marca,
      familia: data.familia,
      cantidad: data.cantidad,
      cantidadMinima: data.cantidadMinima,
      reservada: 0,
      habilitado: data.habilitado,
      precios: precios,
      descripcion: data.descripcion,
    };

    return nuevoArt;
  }


}
