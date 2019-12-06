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

router.get('/:clienteId', getCliente, (req, res) => {
    res.json(res.cliente);
});

router.put('/:clienteId', (req, res) => {
    Cliente
        .updateOne({ _id: req.params.clienteId }, req.body)
        .then(result => {
            res.status(200).json({ message: "Cliente actualizado con éxito." })
        })
})

router.put('/actualizar-cuenta/:clienteId', (req, res) => {
    const dif = req.body.cuenta.saldoGastado;
    const id = req.params.clienteId;

    Cliente
        .findByIdAndUpdate(id, { $inc: { 'cuenta.saldoGastado': dif } })
        .then(result => {
            res.status(200).json({ message: "Estado de la cuenta actualizado con éxito." })
        });
})

async function getCliente(req, res, next) {
    try {
        cliente = await Cliente.findById(req.params.clienteId)
        if (cliente == null) {
            return res.status(404).json({ message: 'No se encontró el cliente' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.cliente = cliente;
    next();
}


module.exports = router