export class Articulo {
    constructor(
        public nombre: string,
        public familia: string,
        public cantidad: number,
        public reservada: number,
        public habilitado: boolean,
        public precios: Array<number>,
        public descripcion: string
    ) { }
}