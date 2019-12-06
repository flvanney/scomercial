const express = require('express')
const router = express.Router()

const Nota = require("../models/nota");

router.post('/', (req, res) => {
    const nota = new Nota(req.body);
    nota.save();

    res.status(201).json({
        message: "Nota agregado con éxito."
    })
})

module.exports = router