const Product = require('../models/Product');
const { asyncHandler, httpError, escapeRegex, str, getPaging } = require('../middleware/helpers');

const toInt = (v) => {
  const n = v === '' || v == null || typeof v === 'boolean' ? NaN : Number(v);
  return Number.isInteger(n) && n >= 0 ? n : null;
};

// Validates the request body on the server (frontend validation is never trusted).
function parseProduct(body, { creating }) {
  const b = body && typeof body === 'object' ? body : {};
  const errors = {};
  const data = {};

  data.name = str(b.name);
  if (!data.name) errors.name = 'Product name is required';
  else if (data.name.length > 100) errors.name = 'Name must be 100 characters or fewer';

  data.category = str(b.category);
  if (!Product.CATEGORIES.includes(data.category)) errors.category = 'Please choose a valid category';

  data.description = str(b.description);
  if (data.description.length > 500) errors.description = 'Description must be 500 characters or fewer';

  data.supplier = str(b.supplier);
  if (data.supplier.length > 100) errors.supplier = 'Supplier must be 100 characters or fewer';

  const price = b.price === '' || b.price == null || typeof b.price === 'boolean' ? NaN : Number(b.price);
  if (!Number.isFinite(price) || price < 0) errors.price = 'Price must be a number that is 0 or more';
  data.price = price;

  data.minimumStock = toInt(b.minimumStock);
  if (data.minimumStock === null) errors.minimumStock = 'Minimum stock must be a whole number that is 0 or more';

  if (creating) {
    data.quantity = toInt(b.quantity);
    if (data.quantity === null) errors.quantity = 'Quantity must be a whole number that is 0 or more';
  }

  data.productId = str(b.productId).toUpperCase();
  if (data.productId && !/^[A-Z0-9-]{1,20}$/.test(data.productId)) {
    errors.productId = 'Use only letters, numbers and hyphens (max 20 characters)';
  }
  return { errors, data };
}

// Generates P001, P002, ... when the user leaves Product ID blank.
async function nextProductId() {
  const all = await Product.find({ productId: /^P\d+$/ }).select('productId').lean();
  const max = all.reduce((m, p) => Math.max(m, parseInt(p.productId.slice(1), 10)), 0);
  return `P${String(max + 1).padStart(3, '0')}`;
}

function buildFilter(q) {
  const filter = {};
  const search = str(q.search);
  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ productId: rx }, { name: rx }];
  }
  const category = str(q.category);
  if (category) filter.category = category;

  const status = str(q.status);
  if (status === 'out') filter.quantity = 0;
  else if (status === 'low') filter.$expr = { $and: [{ $gt: ['$quantity', 0] }, { $lte: ['$quantity', '$minimumStock'] }] };
  else if (status === 'in') filter.$expr = { $gt: ['$quantity', '$minimumStock'] };
  else if (status === 'attention') filter.$expr = { $lte: ['$quantity', '$minimumStock'] }; // low OR out
  return filter;
}

// POST /api/products
exports.createProduct = asyncHandler(async (req, res) => {
  const { errors, data } = parseProduct(req.body, { creating: true });
  if (Object.keys(errors).length) throw httpError(400, 'Please fix the highlighted fields', errors);
  if (!data.productId) data.productId = await nextProductId();
  const product = await Product.create(data); // duplicate IDs are rejected by the unique index
  res.status(201).json({ message: 'Product created', product });
});

// GET /api/products?search=&category=&status=&sortBy=&order=&page=&limit=
exports.getProducts = asyncHandler(async (req, res) => {
  const filter = buildFilter(req.query);
  const sortField = ['name', 'quantity', 'price'].includes(req.query.sortBy) ? req.query.sortBy : 'name';
  const dir = req.query.order === 'desc' ? -1 : 1;
  const { page, limit, skip } = getPaging(req.query, 10, 1000);

  const [products, total] = await Promise.all([
    Product.find(filter).collation({ locale: 'en' }).sort({ [sortField]: dir, _id: 1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);
  res.json({ products, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
});

// GET /api/products/search/:query  (must be declared BEFORE /:id in the router)
exports.searchProducts = asyncHandler(async (req, res) => {
  const text = str(req.params.query);
  if (!text) throw httpError(400, 'Search text is required');
  const rx = new RegExp(escapeRegex(text), 'i');
  const products = await Product.find({ $or: [{ productId: rx }, { name: rx }] }).sort({ name: 1 }).limit(50);
  res.json({ products, total: products.length });
});

// GET /api/products/:id
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw httpError(404, 'Product not found');
  res.json({ product });
});

// PUT /api/products/:id  (quantity is NOT editable here - use the Stock module so history stays correct)
exports.updateProduct = asyncHandler(async (req, res) => {
  const { errors, data } = parseProduct(req.body, { creating: false });
  if (Object.keys(errors).length) throw httpError(400, 'Please fix the highlighted fields', errors);

  if (data.productId) {
    const clash = await Product.findOne({ productId: data.productId, _id: { $ne: req.params.id } }).select('_id');
    if (clash) throw httpError(409, 'This Product ID already exists. Please use a different one.', { productId: 'This Product ID already exists' });
  } else {
    delete data.productId; // keep the existing ID
  }
  const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!product) throw httpError(404, 'Product not found');
  res.json({ message: 'Product updated', product });
});

// DELETE /api/products/:id  (stock history is kept as an audit trail; it stores name/ID snapshots)
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw httpError(404, 'Product not found');
  res.json({ message: `Product "${product.name}" deleted` });
});
