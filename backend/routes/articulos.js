const express = require('express')
const router = express.Router()

const Articulo = require("../models/articulo");


router.get('/', (req, res) => {
    Articulo.find().then(clientes => {
        res.status(200).json(clientes)
    });
})

router.post('/', (req, res) => {
    const art = new Articulo(req.body);
    art.save();

    res.status(201).json({
        message: "Artículo agregado con éxito."
    })
})


module.exports = router;