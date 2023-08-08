const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    image: {
        type: Number,
        default: null
    }
}, { timestamps: { createdAt: 'creation_date', updatedAt: 'updated_date' } })


module.exports = mongoose.model('users', userSchema)