const mongoose = require('mongoose')

const cartsCollection = 'carts';

const cartSchema = new mongoose.Schema({
    id: {
        type: Number,
        required : true,
        unique: true
    },
    products: [{ product: String, quantity: Number }]    
})

module.exports = mongoose.model(cartsCollection, cartSchema);