import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClientesService } from '../clientes.service';
import { Cliente } from '../cliente';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit, OnDestroy {

  clientes: Cliente[] = [];
  private clientesSub: Subscription;

  displayedColumns = ['Nombre', 'DNI', 'Tipo'];

  constructor(private clientesService: ClientesService) { }

  ngOnInit() {
    this.clientesService.traerClientes();
    this.clientesSub = this.clientesService.traerClienteListener()
      .subscribe((clientes: Cliente[]) => {
        this.clientes = clientes;
      });
  }

  ngOnDestroy() {
    this.clientesSub.unsubscribe();
  }
}
