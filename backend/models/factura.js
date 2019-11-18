const mongoose = require("mongoose");

const facturaSchema = mongoose.Schema({

    numero:{
        type: Number,
        required:true,
    },

    tipo:{
        type:Number,
        required:true,
    },

    total:{
        type:Number,
        required:true,
    },


})

module.exports = mongoose.model('Factura', facturaSchema);