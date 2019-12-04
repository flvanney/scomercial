const mongoose = require("mongoose");

const cuentaCorrienteSchema = mongoose.Schema({
    estado:{
        type:String,
        required:true,
    },

    fechaDeActualizacion:{
        type:Date,
        required:true,
    },

    saldoGastado:{
        type: Number,
    },

    creditoMaximo:{
        type: Number,
        required: true,
    },

})

// El esquema es utilizado luego como plantilla para  crear y exportar el modelo.
const clienteSchema = mongoose.Schema({
    organizacion: {
        type: String,
    },
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },
    direccionAlternativa: {
        type: String,
    },
    provincia: {
        type: String,
        required: true,
    },
    ciudad: {
        type: String,
        required: true,
    },
    codigoPostal: {
        type: Number,
        required: true
    },

    telefono:{
        type:Number,
    },

    cuit:{
        type:String,
    },

    cuil:{
        type: String,
    },

    fechaDeInicio:{
        type: Date,
    },

    cuenta: cuentaCorrienteSchema,
})

module.exports = mongoose.model('Cliente', clienteSchema);