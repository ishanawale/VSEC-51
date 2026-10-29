const mongoose = require('mongoose');

const CATEGORIES = ['Electronics', 'Stationery', 'Furniture', 'Cleaning Supplies', 'Equipment', 'Other'];
const wholeNumber = { validator: Number.isInteger, message: '{PATH} must be a whole number' };

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String, required: [true, 'Product ID is required'], unique: true,
      trim: true, uppercase: true, maxlength: 20,
    },
    name: { type: String, required: [true, 'Product name is required'], trim: true, maxlength: 100 },
    category: {
      type: String, required: [true, 'Category is required'],
      enum: { values: CATEGORIES, message: 'Invalid category' },
    },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
    quantity: { type: Number, required: true, min: [0, 'Quantity cannot be negative'], default: 0, validate: wholeNumber },
    minimumStock: { type: Number, required: true, min: [0, 'Minimum stock cannot be negative'], default: 0, validate: wholeNumber },
    supplier: { type: String, trim: true, maxlength: 100, default: '' },
    isSample: { type: Boolean, default: false }, // true only for records inserted by the seed script
  },
  { timestamps: true }
);

// Stock status is always calculated, never stored, so it can never go out of date.
productSchema.virtual('status').get(function () {
  if (this.quantity === 0) return 'OUT_OF_STOCK';
  if (this.quantity <= this.minimumStock) return 'LOW_STOCK';
  return 'IN_STOCK';
});
productSchema.set('toJSON', { virtuals: true });

productSchema.index({ name: 1 });
productSchema.index({ category: 1 });

const Product = mongoose.model('Product', productSchema);
Product.CATEGORIES = CATEGORIES;
module.exports = Product;
