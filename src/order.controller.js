const prisma = require('./utils/prisma');

async function purchaseItem(req, res) {
  try {
    const { userId, productId } = req.body;

    // Validate product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ error: "Product out of stock" });
    }

    // Validate user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log('Product price:', product.price);

    // ATOMIC TRANSACTION: Create order and decrement stock together
    const result = await prisma.$transaction([
      prisma.order.create({
        data: { userId, productId, quantity: 1 },
      }),
      prisma.product.update({
        where: { id: productId },
        data: { stock: { decrement: 1 } },
      }),
    ]);

    res.status(201).json({ order: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getOrdersByUser(req, res) {
  try {
    const userId = parseInt(req.params.userId);
    
    // Validate user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const orders = await prisma.order.findMany({ where: { userId } });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { purchaseItem, getOrdersByUser };