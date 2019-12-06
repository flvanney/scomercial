export class Articulo {
    constructor(
        public _id: string,
        public codigo: string,
        public nombre: string,
        public marca: string,
        public familia: string,
        public cantidad: number,
        public cantidadMinima: number,
        public reservada: number,
        public habilitado: boolean,
        public precios: Array<number>,
        public iva: number,
        public descripcion: string
    ) { }
}