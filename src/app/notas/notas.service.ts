import { Injectable } from '@angular/core';
import { Nota } from './nota';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../clientes/cliente';

@Injectable({
  providedIn: 'root'
})
export class NotasService {

  constructor(private http: HttpClient) { }

  guardarNota(nota) {
    // 1ero guardo la nota, 2do actualizo el monto gastado en la cuenta del cliente.

    const monto = nota.tipoNota === "C" ? -nota.monto : nota.monto;

    this.http.post<Nota>(`http://localhost:3000/notas`, nota).subscribe(res => {
      this.http
        .put<Cliente>(`http://localhost:3000/clientes/actualizar-cuenta/${nota.cliente}`,
          { cuenta: { saldoGastado: monto } })
        .subscribe();
    });
  }
}
