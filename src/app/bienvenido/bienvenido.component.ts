import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bienvenido',
  template:  `<p>Bienvenido al Sistema Comercial, seleccioná una opción en el menú de la izquierda para continuar.`,
})
export class BienvenidoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
