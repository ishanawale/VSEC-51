const mongoose = require('mongoose');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const { asyncHandler, httpError, escapeRegex, str, getPaging } = require('../middleware/helpers');

async function recordTransaction(req, type) {
  const b = req.body && typeof req.body === 'object' ? req.body : {};
  const errors = {};

  const productRef = typeof b.product === 'string' ? b.product : '';
  if (!mongoose.Types.ObjectId.isValid(productRef)) errors.product = 'Please select a product';

  const qty = b.quantity === '' || b.quantity == null || typeof b.quantity === 'boolean' ? NaN : Number(b.quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > 1000000) errors.quantity = 'Quantity must be a whole number greater than 0';

  const reasons = type === 'IN' ? StockMovement.IN_REASONS : StockMovement.OUT_REASONS;
  const reason = str(b.reason);
  if (!reasons.includes(reason)) errors.reason = 'Please choose a valid reason';

  const notes = str(b.notes);
  if (notes.length > 300) errors.notes = 'Notes must be 300 characters or fewer';

  if (Object.keys(errors).length) throw httpError(400, 'Please fix the highlighted fields', errors);

  const delta = type === 'IN' ? qty : -qty;

  // ONE atomic database operation: for OUT the filter also requires quantity >= qty,
  // so stock can never go negative, even if two requests arrive at the same moment.
  const filter = { _id: productRef };
  if (type === 'OUT') filter.quantity = { $gte: qty };
  const before = await Product.findOneAndUpdate(filter, { $inc: { quantity: delta } }, { new: false });

  if (!before) {
    const existing = await Product.findById(productRef).select('quantity');
    if (!existing) throw httpError(404, 'Product not found');
    throw httpError(400, `Insufficient stock: only ${existing.quantity} unit(s) available`, { quantity: `Only ${existing.quantity} unit(s) available` });
  }

  let movement;
  try {
    movement = await StockMovement.create({
      product: before._id, productId: before.productId, productName: before.name,
      type, quantity: qty, reason, notes,
      previousQuantity: before.quantity, newQuantity: before.quantity + delta,
    });
  } catch (err) {
    // Could not save the history record -> undo the quantity change so data stays consistent.
    await Product.updateOne({ _id: before._id }, { $inc: { quantity: -delta } });
    throw err;
  }
  const product = await Product.findById(before._id);
  return { movement, product };
}

// POST /api/stock/in
exports.stockIn = asyncHandler(async (req, res) => {
  const result = await recordTransaction(req, 'IN');
  res.status(201).json({ message: `Added ${result.movement.quantity} unit(s) to ${result.product.name}`, ...result });
});

// POST /api/stock/out
exports.stockOut = asyncHandler(async (req, res) => {
  const result = await recordTransaction(req, 'OUT');
  res.status(201).json({ message: `Removed ${result.movement.quantity} unit(s) from ${result.product.name}`, ...result });
});

// GET /api/stock?search=&type=&date=YYYY-MM-DD&page=&limit=
exports.getMovements = asyncHandler(async (req, res) => {
  const filter = {};
  const search = str(req.query.search);
  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ productId: rx }, { productName: rx }];
  }
  const type = str(req.query.type);
  if (type === 'IN' || type === 'OUT') filter.type = type;

  const date = str(req.query.date);
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const start = new Date(`${date}T00:00:00`);
    const end = new Date(`${date}T23:59:59.999`);
    if (!Number.isNaN(start.getTime())) filter.createdAt = { $gte: start, $lte: end };
  }

  const { page, limit, skip } = getPaging(req.query, 10, 200);
  const [movements, total] = await Promise.all([
    StockMovement.find(filter).sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit),
    StockMovement.countDocuments(filter),
  ]);
  res.json({ movements, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
});

// GET /api/stock/:id
exports.getMovement = asyncHandler(async (req, res) => {
  const movement = await StockMovement.findById(req.params.id);
  if (!movement) throw httpError(404, 'Stock movement not found');
  res.json({ movement });
});
