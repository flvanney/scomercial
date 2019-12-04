import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Articulo } from '../articulo';
import { ArticulosService } from '../articulos.service';
import { MatTableDataSource } from '@angular/material/table';

export interface ArticuloInterface{
  nombre: string;
  familia: string;
  descripcion: string;
}

@Component({
  selector: 'app-lista-de-articulos',
  templateUrl: './lista-de-articulos.component.html',
  styleUrls: ['./lista-de-articulos.component.css']
})
export class ListaDeArticulosComponent implements OnInit {

  articulos: any[] = [];
  private articulosSub: Subscription;

  displayedColumns = ['nombre', 'familia', 'descripcion'];
  dataSource = new MatTableDataSource<ArticuloInterface>(this.articulos);

  constructor(private articulosService: ArticulosService) {}

  ngOnInit() {
    this.articulosService.traerArticulos();
    this.articulosService.traerArticuloListener()
      .subscribe((articulos: Articulo[]) => {
        this.articulos = articulos;
      });
    this.dataSource = new MatTableDataSource<ArticuloInterface>(this.articulos);
    console.log(this.articulos);
    //console.log(this.dataSource);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

/*  traerPrecios(i: number) {
    /* Si el usuario seleccionó un artículo se le devuelve la lista 
    de precios que le corresponde al mismo. Sino, una lista vacía. 

    const sinSeleccionar = this.pedidoForm.value.ventas[i].articulo == null ? true : false;

    return sinSeleccionar ? [] : this.pedidoForm.value.ventas[i].articulo.precios;
  }

  public formatearMoneda(monto: number) {
    return formatCurrency(monto, 'esAR', '$', 'ARS');
  }

*/

