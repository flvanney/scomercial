const mongoose = require("mongoose");

const notaSchema = mongoose.Schema({
    numero: {
        type: Number,
        require: true,
    },

    estado: {
        type: String,
        required: true,
    },

    monto:{
        type: Number,
        required: true,
    },

    fecha: {
        type: Date,
        required:true,
    },

    tipoNota: {
        type: String,
        required: true,
    },


})

module.exports = mongoose.model('Nota', notaSchema);