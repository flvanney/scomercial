const express = require('express')
const router = express.Router()

const Articulo = require("../models/articulo");


router.get('/', (req, res) => {
    Articulo.find().then(clientes => {
        res.status(200).json(clientes)
    });
})

module.exports = router;