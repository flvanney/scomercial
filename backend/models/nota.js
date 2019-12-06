const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Cliente = require("./cliente");

const notaSchema = Schema({
    numero: { type: Number, require: true, unique: true },
    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
    monto: { type: Number, required: true },
    fecha: { type: Date, required: true },
    tipoNota: { type: String, required: true },
    motivo: String,
})

module.exports = mongoose.model('Nota', notaSchema);