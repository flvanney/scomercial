export class Nota {
    constructor(
        public numero: number,
        public tipoNota: string,
        public cliente: string,
        public monto: number,
        public fecha: Date,
        public motivo: string
    ) { }
}