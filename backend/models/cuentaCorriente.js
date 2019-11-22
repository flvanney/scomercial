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

})

module.exports = mongoose.model('CuentaCorriente', cuentaCorrienteSchema);