const mongoose = require("mongoose");
const Cliente = require("./cliente");
const Articulo = require("./articulo");
const Schema = mongoose.Schema;

const ventaSchema = Schema({
    nro: {
        type: Number,
        unique: true
    },

    fecha: Date,

    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente' },

    ventas: [{
        articulo: { type: Schema.Types.ObjectId, ref: 'Articulo' },
        cantidad: Number,
        precio: Number,
    }],

    metodopago: String,

    envio: Boolean,

    observaciones: String,
});

module.exports = mongoose.model('Venta', ventaSchema);