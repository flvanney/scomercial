export class Cliente {
    constructor(
        // tslint:disable-next-line: variable-name
        public _id: string,
        public nombre: string,
        public apellido: string,
        public direccion: string,
        public direccionAlternativa: string,
        public provincia: string,
        public ciudad: string,
        public codigoPostal: string,
        public factura: string,
    ) { }
}

export class Provincia {
    constructor(
        public nombre: string,
    ) { }
}
