const mongoose = require("mongoose");

// El esquema es utilizado luego como plantilla para 
// crear y exportar el modelo.
const clienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    dni: {
        type: String,
        unique: true,
        required: true,
    },
    tipo: {
        type: String,
        required: true,
    }
    // TODO: Completar con el resto de atributos
})

module.exports = mongoose.model('Cliente', clienteSchema);