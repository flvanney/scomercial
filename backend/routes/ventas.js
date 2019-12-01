const express = require('express')
const router = express.Router()

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
    Venta
        .find({ cliente: req.params.idCliente })
        .then(ventas => {
            res.status(200).json(ventas)
        });
})


module.exports = router