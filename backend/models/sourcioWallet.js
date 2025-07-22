const { Schema, model } = require('mongoose')

const sourcioWalletSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    manth: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    }
}, { timestamps: true })


module.exports = model('sourcioShopWallets', sourcioWalletSchema)