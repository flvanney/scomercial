const mongoose = require("mongoose");

const articuloSchema = mongoose.Schema({

    nombre: {
        type: String,
        required: true,
    },
    
    familia: {
        type: String,
    },

    cantidad:{
        type: Number,
        required: true,
    },

    reservada:{
        type: Number,
    },

    habilitado:{
        type: Boolean,
        required: true,
    },

    precio1:{
        type: Number,
        required: true,
    },


    precio2:{
        type: Number,
    },

    precio3:{
        type: Number,
    },

    precio4:{
        type: Number,
    },

    descripcion:{
        type: String,
    },
})

module.exports = mongoose.model('Articulo', articuloSchema);