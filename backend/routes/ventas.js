const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');

const Venta = require("../models/venta");

router.post('/', (req, res) => {
    const venta = new Venta(req.body);    
    venta.save();

    res.status(201).json({
        message: "Venta agregada con éxito."
    })
})

router.get('/ult', (req, res) => {
    Venta
        .findOne()
        .select('nro')
        .sort({ nro: -1 })
        .then(ultima => {
            res.status(200).json(ultima)
        });
})

router.get('/', (req, res) => {
    Venta
        .find()
        .then(ventas => {
            res.status(200).json(ventas)
        });
})

router.get('/:idCliente', (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.idCliente)) {
        Venta
        .find({ cliente: req.params.idCliente })
        .then(ventas => {
            res.status(200).json(ventas)
        });
    } else {
        res.status(404).send('ID inválida');
    }
    
})

module.exports = router