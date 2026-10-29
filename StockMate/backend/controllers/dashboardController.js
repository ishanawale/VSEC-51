const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const { asyncHandler } = require('../middleware/helpers');

const isLow = { $and: [{ $gt: ['$quantity', 0] }, { $lte: ['$quantity', '$minimumStock'] }] };

// GET /api/dashboard - everything is computed from the stored records on every request
exports.getDashboard = asyncHandler(async (req, res) => {
  const [totals, categories, lowStock, recentMovements] = await Promise.all([
    Product.aggregate([{
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalUnits: { $sum: '$quantity' },
        totalValue: { $sum: { $multiply: ['$price', '$quantity'] } },
        outOfStock: { $sum: { $cond: [{ $eq: ['$quantity', 0] }, 1, 0] } },
        lowStock: { $sum: { $cond: [isLow, 1, 0] } },
      },
    }]),
    Product.aggregate([
      { $group: { _id: '$category', products: { $sum: 1 }, units: { $sum: '$quantity' }, value: { $sum: { $multiply: ['$price', '$quantity'] } } } },
      { $sort: { units: -1 } },
    ]),
    Product.find({ $expr: { $lte: ['$quantity', '$minimumStock'] } }).sort({ quantity: 1, name: 1 }).limit(8),
    StockMovement.find().sort({ createdAt: -1, _id: -1 }).limit(8),
  ]);

  const t = totals[0] || { totalProducts: 0, totalUnits: 0, totalValue: 0, outOfStock: 0, lowStock: 0 };
  res.json({
    stats: {
      totalProducts: t.totalProducts,
      totalUnits: t.totalUnits,
      lowStock: t.lowStock,
      outOfStock: t.outOfStock,
      totalValue: Math.round(t.totalValue * 100) / 100,
    },
    categories: categories.map((c) => ({ category: c._id, products: c.products, units: c.units, value: Math.round(c.value * 100) / 100 })),
    lowStock,
    recentMovements,
  });
});
