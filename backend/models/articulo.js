const mongoose = require("mongoose");

const articuloSchema = mongoose.Schema({

    nombre: {
        type: String,
        required: true,
    },
    
    familia: String,

    cantidad:{
        type: Number,
        required: true,
    },

    reservada: Number,

    habilitado:{
        type: Boolean,
        required: true,
    },

    precios: [Number],

    descripcion:{
        type: String,
    },

    iva: {
        type: Number,
    },
})

module.exports = mongoose.model('Articulo', articuloSchema);