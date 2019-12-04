const mongoose = require("mongoose");

const articuloSchema = mongoose.Schema({
    codigo: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    marca: { type: String, required: true },
    familia: String,
    cantidad: { type: Number, required: true },
    cantidadMinima: Number,
    reservada: Number,
    habilitado: { type: Boolean, required: true },
    precios: [Number],
    descripcion: String,
    iva: Number
})

module.exports = mongoose.model('Articulo', articuloSchema);