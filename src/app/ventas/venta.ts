export class Venta {
    constructor(
        // tslint:disable-next-line: variable-name
        public _id: string,
        public nro: number,
        public fecha: string,
        public cliente: string,
        public ventas: Array<Articulos>,
        public metodopago: string,
        public envio: boolean,
        public observaciones: string
    ) { }
}

class Articulos {
    constructor(
        public articulo: string,
        public cantidad: number,
        public precio: number,
    ) { }
}