const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
    next();
});

mongoose.connect(process.env.BD_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log("Conexión con MongoDB establecida. Vamos los pibes...");
    }).catch(() => {
        console.log("No se pudo conectar con MongoDB.");
    })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Uy, se cayó el sistema:'));


/* Acá se cargan y definen las rutas de las consultas*/

const rutasClientes = require("./routes/clientes");
app.use('/clientes', rutasClientes);

const rutasPedidos = require("./routes/pedidos");
app.use('/pedidos', rutasPedidos);

module.exports = app;
