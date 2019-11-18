const mongoose = require("mongoose");

const notaCreditoSchema = mongoose.Schema({
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


})

module.exports = mongoose.model('NotaCredito', notaCreditoSchema);