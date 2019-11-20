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

}
