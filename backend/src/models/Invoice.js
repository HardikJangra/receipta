const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number
});

const invoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    clientName: String,
    clientEmail: String,
    items: [itemSchema],
    tax: {
      type: Number,
      default: 0
    },
    subtotal: Number,
    total: Number,
    status: {
      type: String,
      enum: ['draft', 'pending', 'paid'],
      default: 'draft'
    },
    dueDate: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);