const express = require('express')
const router = express.Router()

const Articulo = require("../models/articulo");

router.get('/', (req, res) => {
    Articulo.find().then(articulos => {
        res.status(200).json(articulos)
    });
})

router.get('/:artId', getArticulo, (req, res) => {
    res.json(res.articulo);
});

router.post('/', (req, res) => {
    const art = new Articulo(req.body);
    art.save();

    res.status(201).json({
        message: "Artículo agregado con éxito."
    })
})

router.put('/:artId', (req, res) => {
    const art = new Articulo(req.body);
    Articulo
        .updateOne({ _id: req.params.artId }, art)
        .then(res => {
            res.status(200).json({ mensaje: 'Artículo actualizado' });
        });
})

async function getArticulo(req, res, next) {
    try {
        articulo = await Articulo.findById(req.params.artId)
        if (articulo == null) {
            return res.status(404).json({ message: 'No se encontró el artículo' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.articulo = articulo;
    next();
}

module.exports = router;