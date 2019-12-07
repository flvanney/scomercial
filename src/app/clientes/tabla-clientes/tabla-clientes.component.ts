import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ClientesService } from '../clientes.service';
import { Cliente } from '../cliente';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { DialogoVentasComponent } from '../dialogo-ventas/dialogo-ventas.component';
import { DialogoCuentaComponent } from '../dialogo-cuenta/dialogo-cuenta.component';

interface ClienteInterface {
  nombre: string;
  apellido: string;
  direccion: string;
}

@Component({
  selector: 'app-tabla-clientes',
  templateUrl: './tabla-clientes.component.html',
  styleUrls: ['./tabla-clientes.component.css']
})
export class TablaClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  dataSource: MatTableDataSource<ClienteInterface>;

  displayedColumns = ['nombreCompleto', 'organizacion', 'direccion', 'historial', 'cuenta', 'editar'];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private clientesService: ClientesService,
    private dialogo: MatDialog) { }

  ngOnInit() {
    this.clientesService.traerClientes();
    this.clientesService.traerClienteListener()
      .subscribe((clientes: Cliente[]) => {
        this.clientes = clientes;
        this.dataSource = new MatTableDataSource<ClienteInterface>(this.clientes);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  abrirDialogoHistorial(cliente) {
    this.dialogo.open(DialogoVentasComponent, { data: cliente });
  }

  abrirDialogoCuenta(cliente) {
    this.dialogo.open(DialogoCuentaComponent, { data: cliente });
  }

  nombre(cliente) {
    return `${cliente.nombre} ${cliente.apellido}`;
  }

}
