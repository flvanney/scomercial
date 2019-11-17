const mongoose = require("mongoose");
const Cliente = require("./cliente");
const Schema = mongoose.Schema;

const pedidoSchema = Schema({
    nro:    Number,
    fecha:  Date,
    solicitante: [{ type: Schema.Types.ObjectId, ref: 'Cliente' }],
    // Ref a articulos
    metodopago: String,
    envio: Boolean,
    observaciones: String,
});

module.exports = mongoose.model('Pedido', pedidoSchema);