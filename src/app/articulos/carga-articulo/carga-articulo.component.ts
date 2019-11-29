import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ArticulosService } from '../articulos.service';


@Component({
  selector: 'app-carga-articulo',
  templateUrl: './carga-articulo.component.html',
  styleUrls: ['./carga-articulo.component.css']
})
export class CargaArticuloComponent implements OnInit {

  artForm = this.fb.group({
    
  })

  constructor(
    private articulosService: ArticulosService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
  }

}
