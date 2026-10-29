const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productId: { type: String, required: true },     // snapshot, survives product edits/deletes
    productName: { type: String, required: true },   // snapshot
    type: { type: String, enum: ['IN', 'OUT'], required: true },
    quantity: { type: Number, required: true, min: 1, validate: { validator: Number.isInteger, message: 'Quantity must be a whole number' } },
    reason: { type: String, required: true, trim: true },
    notes: { type: String, trim: true, maxlength: 300, default: '' },
    previousQuantity: { type: Number, required: true, min: 0 },
    newQuantity: { type: Number, required: true, min: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

stockMovementSchema.index({ createdAt: -1 });
stockMovementSchema.index({ product: 1 });

const StockMovement = mongoose.model('StockMovement', stockMovementSchema);
StockMovement.IN_REASONS = ['New Purchase', 'Return', 'Adjustment'];
StockMovement.OUT_REASONS = ['Sale', 'Internal Use', 'Damaged Goods', 'Adjustment'];
module.exports = StockMovement;
