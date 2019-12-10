const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Nota = require("../models/nota");

router.post('/', (req, res) => {
    const nota = new Nota(req.body);
    nota.save();

    res.status(201).json({
        message: "Nota agregado con éxito."
    })
})

router.get('/:idCliente', (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.idCliente)) {
        Nota
        .find({ cliente: req.params.idCliente })
        .then(notas => {
            res.status(200).json(notas)
        });
    } else {
        res.status(404).send('ID inválida');
    }
})

router.get('/', (req, res) => {
    Nota.find().then(notas => {
        res.status(200).json(notas)
    });
})


module.exports = router