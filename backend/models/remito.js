const mongoose = require("mongoose");

const remitoSchema = mongoose.Schema({

    numero:{
        type: Number,
        required: true,
    },

    estado:{
        type: String,
        required:true,
    },

    tipo:{
        type: String,
        required: true,
    },

})

module.exports = mongoose.model('Remito', remitoSchema);