const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

// SLOW ENDPOINT 1 — Missing index on 'category' column (causing Seq Scan)
// Product Listing by Category
router.get('/', async (req, res) => {
  const { category } = req.query;
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));

  if (!category) {
    return res.status(400).json({ success: false, message: 'Category is required' });
  }

  try {
    const where = { category };
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          category: true,
          price: true,
          imageUrl: true,
          createdAt: true
        }
      })
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    res.json({
      success: true,
      data: products,
      meta: {
        currentPage: page,
        totalPages,
        total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
