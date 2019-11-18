const mongoose = require("mongoose");

const cuentaCorrienteSchema = mongoose.Schema({
    estado:{
        type:String,
        required:true,
    },

    fecha:{
        type:Date,
        required:true,
    },

    credito:{
        type: Number,
    },

    tipo:{
        type:String,
    },
})

module.exports = mongoose.model('CuentaCorriente', cuentaCorrienteSchema);