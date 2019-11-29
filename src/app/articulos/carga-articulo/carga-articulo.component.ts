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
    nombre: [null, Validators.required],
    familia: [null, Validators.required],
    cantidad: [null, Validators.required],
    p1: [null, Validators.required],
    p2: null,
    p3: null,
    p4: null,
    descripcion: null
  })

  constructor(
    private articulosService: ArticulosService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
  }

  cargarArt() {
    this.articulosService.cargarArt(this.artForm.value);
  }

  esRequerido(campo: string) {
    return this.artForm.controls[campo].hasError('required');
  }


}
