const express = require('express')
const router = express.Router()

const Cliente = require("../models/cliente");

router.post('/', (req, res) => {
    const cliente = new Cliente(req.body);
    cliente.save();

    res.status(201).json({
        message: "Cliente agregado con éxito."
    })
})

router.get('/', (req, res) => {
    Cliente.find().then(clientes => {
        res.status(200).json(clientes)
    });
})

router.delete('/:id', (req, res) => {
    Cliente.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);
        res.status(200).json({ message: "Cliente eliminado con éxito." });
    });
});

module.exports = router