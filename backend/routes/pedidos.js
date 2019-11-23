const express = require('express')
const router = express.Router()

const Pedido = require("../models/pedido");

router.post('/', (req, res) => {
    const pedido = new Pedido(req.body);
    
    pedido.save();

    res.status(201).json({
        message: "Pedido agregado con éxito."
    })
})

router.get('/ult', (req, res) => {
    Pedido
        .findOne()
        .select('nro')
        .sort({ nro: -1 })
        .then(ultimo => {
            res.status(200).json(ultimo)
        });
})

module.exports = router