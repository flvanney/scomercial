export class Articulo {
    constructor(
        public _id: string,
        public nombre: string,
        public familia: string,
        public cantidad: number,
        public reservada: number,
        public habilitado: boolean,
        public precio1: number,
        public precio2: number,
        public precio3: number,
        public precio4: number,
        public descripcion: string
    ) { }
}