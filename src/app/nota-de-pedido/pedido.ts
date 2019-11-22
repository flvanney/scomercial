export class Pedido {
    constructor(
        // tslint:disable-next-line: variable-name
        public _id: string,
        public nro: string,
        public fecha: string,
        public cliente: string,
        public ventas: Array<Venta>,
        public metodopago: string,
        public envio: boolean,
        public observaciones: string
    ) { }
}

class Venta {
    constructor(
        public articulo: string,
        public cantidad: number,
        public precio: number,
    ) { }
}