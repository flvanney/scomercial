const mongoose = require("mongoose");

const transportistaSchema = mongoose.Schema({

    nombre:{
        type:String,
        required: true,
    },

    direccion:{
        type: String,
        required:true,
    },

    telefono:{
        type:Number,
        required:true,
    },

    mail:{
        type:String,
    },

})

module.exports = mongoose.model('transportista', transportistaSchema);