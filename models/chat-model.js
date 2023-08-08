const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const chatSchema = new mongoose.Schema({
  sender: {
    type: {
      userId: Types.ObjectId,
      name: String,
    },
    required: true,
  },
  receiver: {
    required: true,
    type: {
      userId: Types.ObjectId,
      name: String,
    },
  },
  text: {
    required: true,
    type: String
  },
  file: {
    type: {
      name: String,
      path: String,
      size: String
    },
    default: null
  }
}, { timestamps: { createdAt: 'creation_date', updatedAt: 'updated_date' } })

module.exports = mongoose.model('chats', chatSchema)