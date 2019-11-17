export class Pedido {
    constructor(
        // tslint:disable-next-line: variable-name
        public _id: string,
        public nro: string,
        public fecha: string,
        public solicitante: string,
        public metodopago: string,
        public envio: boolean,
        public observaciones: string
    ) { }
}
