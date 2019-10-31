const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const DATABASE_URL = "mongodb+srv://admin:admin@sventas-bqjrc.gcp.mongodb.net/scomercial?retryWrites=true&w=majority";

const Cliente = require("./models/cliente");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
    next();
});

mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log("Conexión con MongoDB establecida. Vamos los pibes...");
    }).catch(() => {
        console.log("No se pudo conectar con MongoDB.");
    })

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Uy, se cayó el sistema:'));


app.post("/clientes", (req, res) => {
    const cliente = new Cliente(req.body);
    cliente.save();
    console.log(`Cliente '${req.body.nombre}' cargado.`);

    res.status(201).json({
        message: "Cliente agregado con éxito."
    })
})

app.get("/clientes", (req, res) => {
    Cliente.find().then(clientes => {
        res.status(200).json(clientes)
    });
})

app.delete("/clientes/:id", (req, res) => {
    Cliente.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);
        res.status(200).json({ message: "Cliente eliminado con éxito. " });
    });
});

module.exports = app;
