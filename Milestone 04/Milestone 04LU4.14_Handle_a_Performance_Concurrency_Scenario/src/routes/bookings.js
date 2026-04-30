// src/routes/bookings.js

const express = require('express');
const router  = express.Router();
const bookingService = require('../services/bookingService');

// ❌ FLAW 1: No rate limiter on this route.
//
// Any IP can send unlimited requests per second.
// A bot or a double-click can flood this endpoint and exhaust
// your server's resources before a single real user gets through.
//
// Fix required:
//   - Install express-rate-limit
//   - Create src/middleware/rateLimiter.js
//   - Apply bookingLimiter as middleware before this handler

// POST /api/bookings/book
// Books a seat for a show on behalf of a user
router.post('/book', async (req, res, next) => {
  try {
    const { userId, seatId, showId } = req.body;

    if (!userId || !seatId || !showId) {
      return res.status(400).json({
        message: 'userId, seatId, and showId are required'
      });
    }

    const result = await bookingService.createBooking({
      userId: Number(userId),
      seatId: Number(seatId),
      showId: Number(showId)
    });

    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }

    res.status(201).json(result.booking);
  } catch (err) {
    next(err);
  }
});

// GET /api/bookings/show/:showId
// Returns all bookings for a show — useful for verifying race condition results
router.get('/show/:showId', async (req, res, next) => {
  try {
    const showId = Number(req.params.showId);
    const bookings = await bookingService.getBookingsByShow(showId);

    res.status(200).json({
      total: bookings.length,
      bookings
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/bookings/:id
router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { userId, seatId, showId } = req.body;

    const result = await bookingService.updateBooking(id, {
      userId: userId !== undefined ? Number(userId) : undefined,
      seatId: seatId !== undefined ? Number(seatId) : undefined,
      showId: showId !== undefined ? Number(showId) : undefined,
    });

    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json(result.booking);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/bookings/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const result = await bookingService.deleteBooking(id);

    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
