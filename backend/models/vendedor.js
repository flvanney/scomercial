const mongoose = require("mongoose");

const vendedorSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },

    apellido: {
        type: String,
        required: true,
    },


})

module.exports = mongoose.model('Vendedor', vendedorSchema);