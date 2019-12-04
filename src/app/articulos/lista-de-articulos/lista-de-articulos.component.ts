import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Articulo } from '../articulo';
import { ArticulosService } from '../articulos.service';
import { MatTableDataSource } from '@angular/material/table';

export interface ArticuloInterface {
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

  displayedColumns = ['codigo', 'nombre', 'marca', 'familia', 'descripcion', 'habilitado', 'cantidad', 'editar'];
  dataSource = new MatTableDataSource<ArticuloInterface>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private articulosService: ArticulosService) { }

  ngOnInit() {
    this.articulosService.traerArticulos();
    this.articulosService.traerArticuloListener()
      .subscribe((articulos: Articulo[]) => {
        this.articulos = articulos;
        this.dataSource = new MatTableDataSource<ArticuloInterface>(articulos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  estaHabilitado(siONo) {
    return siONo == true ? 'Sí' : 'No';
  }

  color(habilitado) {
    return habilitado == true ? 'green' : 'red';
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
}
