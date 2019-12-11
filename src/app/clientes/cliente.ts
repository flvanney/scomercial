export class Cliente {
    constructor(
        // tslint:disable-next-line: variable-name
        public _id: string,
        public nombre: string,
        public apellido: string,
        public organizacion: string,
        public direccion: string,
        public direccionAlternativa: string,
        public provincia: string,
        public ciudad: string,
        public codigoPostal: string,
        public telefono: string,
        public dni: string,
        public cuit: string,
        public cuil: string,
        public tipoFactura: string,
        public fechaDeInicio: string,
        public cuenta: Cuenta
    ) { }
}

export class Provincia {
    constructor(
        public nombre: string,
    ) { }
}

export class Cuenta {
    constructor(
        public estado: boolean,
        public fechaDeActualizacion: string,
        public saldoGastado: number,
        public creditoMaximo: number
    ) { }
}