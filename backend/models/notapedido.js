const mongoose = require("mongoose");
const Cliente = require("./models/cliente");

const notaPedidoSchema = mongoose.Schema({
    nro:    Number,
    fecha:  Date,
    solicitante: [{ type: Schema.Types.ObjectId, ref: 'Cliente' }],
    // Ref a articulos
    metodopago: String,
    envio: Boolean,
    observaciones: String,
});

module.exports = mongoose.model('NotaPedido', notaPedidoSchema);