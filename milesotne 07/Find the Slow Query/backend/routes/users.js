const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

// SLOW ENDPOINT 3 — SELECT * on a wide table with large text columns
// User Activity Log (1.5-3 seconds)
router.get('/:id/activity', async (req, res) => {
  const { id } = req.params;

  try {
    const activities = await prisma.activity.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        data: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
