import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-dialogo-ventas',
  templateUrl: './dialogo-ventas.component.html',
  styleUrls: ['./dialogo-ventas.component.css']
})
export class DialogoVentasComponent {

  message: string = "Diálogo de prueba"
  cancelButtonText = "Salir"

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DialogoVentasComponent>) {
    if (data) {
      this.message = data.message || this.message;
      if (data.buttonText) {
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
    }
    this.dialogRef.updateSize('300vw', '300vw')
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

}
