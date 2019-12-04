import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ArticulosService } from '../articulos.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Articulo } from '../articulo';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBarConfig } from '@angular/material/snack-bar';


@Component({
  selector: 'app-carga-articulo',
  templateUrl: './carga-articulo.component.html',
  styleUrls: ['./carga-articulo.component.css']
})
export class CargaArticuloComponent implements OnInit {

  private artId: string;
  articulo: Articulo;
  modo: string;

  artForm = this.fb.group({
    codigo: [null, Validators.required],
    nombre: [null, Validators.required],
    marca: [null, Validators.required],
    familia: [null, Validators.required],
    cantidad: [null, Validators.required],
    cantidadMinima: null,
    p1: [null, Validators.required],
    p2: null,
    p3: null,
    p4: null,
    habilitado: true,
    descripcion: null
  })

  constructor(
    private articulosService: ArticulosService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {

    // Detecto si estoy editando o creando un art. nuevo.

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('artId')) {
        this.modo = 'editar';
        this.artId = paramMap.get('artId');
        this.articulosService.buscarArt(this.artId).subscribe(articulo => {
          this.articulo = articulo;
          this.artForm.patchValue(
            {
              codigo: this.articulo.codigo,
              nombre: this.articulo.nombre,
              marca: this.articulo.marca,
              familia: this.articulo.familia,
              cantidad: this.articulo.cantidad,
              cantidadMinima: this.articulo.cantidadMinima,
              p1: this.articulo.precios[0],
              p2: this.articulo.precios[1],
              p3: this.articulo.precios[2],
              p4: this.articulo.precios[3],
              descripcion: this.articulo.descripcion,
              habilitado: this.articulo.habilitado,
            });
        })
      }
      else {
        this.modo = 'crear';
        this.artId = null;
      }
    });
  }

  guardarArt() {

    /*  1er caso: que el formulario sea inválido
        2do caso: que se esté modificando un artículo
        3er caso: que se esté creando un artículo nuevo */

    if (this.artForm.invalid) {
      this.abrirSnackBar('No se guardó nada, completá todos los campos obligatorios flaco.', 'Y bueno', 'snack-roja');
    }
    else if (this.modoEditar()) {
      this.articulosService.actualizarArt(this.articulo._id, this.artForm.value);
      this.abrirSnackBar('Artículo modificado con éxito.', 'Okas', 'snack-verde');
    } else {
      this.articulosService.guardarArt(this.artForm.value);
      this.abrirSnackBar('Artículo cargado con éxito.', 'Graciela', 'snack-verde');
      this.reiniciarForm();
      this.limpiarErroresForm();
    }
  }

  reiniciarForm() {
    this.artForm.reset({ habilitado: true });
  }

  limpiarErroresForm() {
    Object.keys(this.artForm.controls).forEach(key => {
      this.artForm.get(key).setErrors(null);
    });
  }

  esRequerido(campo: string) {
    return this.artForm.controls[campo].hasError('required');
  }

  modoEditar(): boolean {
    return this.modo == 'editar';
  }

  abrirSnackBar(msg: string, accion: string, clase: string) {
    this.snackBar.open(msg, accion,
      {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: [clase]
      })
  }


}
