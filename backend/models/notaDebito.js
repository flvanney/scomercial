const mongoose = require("mongoose");

const notaDebitoSchema = mongoose.Schema({
    numero: {
        type: Number,
        required: true,
    },

    estado:{
        type: String,
        required: true,
    },

    monto:{
        type: Number,
        required: true,
    },

    tipoPago:{
        type: String,
    },

    fecha: {
        type: Date,
        required: true,
    },

})

module.exports = mongoose.model('NotaDebito', notaDebitoSchema);