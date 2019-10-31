const mongoose = require("mongoose");

// El esquema es utilizado luego como plantilla para  crear y exportar el modelo.
const clienteSchema = mongoose.Schema({
    organizacion: {
        type: String,
    },
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },
    direccionAlternativa: {
        type: String,
    },
    provincia: {
        type: String,
        required: true,
    },
    ciudad: {
        type: String,
        required: true,
    },
    codigoPostal: {
        type: Number,
        required: true
    },
    factura: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Cliente', clienteSchema);