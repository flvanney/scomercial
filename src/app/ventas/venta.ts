import { Cliente } from '../clientes/cliente';
import { Articulo } from '../articulos/articulo';

export class Venta {
    constructor(
        // tslint:disable-next-line: variable-name
        public _id: string,
        public nro: number,
        public fecha: string,
        public cliente: string,
        public vendedor: string,
        public ventas: Array<Articulos>,
        public metodoDePago: string,
        public envio: boolean,
        public observaciones: string,
        public desgravado: number,
        public montoTotal: number,
        public datosCliente?: Cliente,
    ) { }
}

class Articulos {
    constructor(
        public articulo: string,
        public cantidad: number,
        public precio: number,
        public totalFilaSinIva: number,
        public datosArticulo?: Articulo,
    ) { }
}