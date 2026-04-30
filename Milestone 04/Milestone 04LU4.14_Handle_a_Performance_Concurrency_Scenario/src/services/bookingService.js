const { PrismaClient } = require('@prisma/client');
const { setCache, getCache, deleteCache } = require('./cacheService');

const prisma = new PrismaClient();

function showBookingsKey(showId) {
  return `bookings:list:${showId}`;
}

function bookingKey(id) {
  return `booking:${id}`;
}

function invalidateBookingCaches(bookingId, showId) {
  deleteCache(showBookingsKey(showId));
  deleteCache(bookingKey(bookingId));
}

async function createBooking({ userId, seatId, showId }) {
  try {
    const booking = await prisma.booking.create({
      data: { userId, seatId, showId },
      include: {
        user: { select: { id: true, name: true } },
        seat: { select: { id: true, number: true } },
      },
    });

    setCache(bookingKey(booking.id), booking);
    deleteCache(showBookingsKey(showId));

    return { success: true, status: 201, booking };
  } catch (err) {
    if (err?.code === 'P2002') {
      return {
        success: false,
        status: 409,
        message: 'Seat already booked for this show',
      };
    }

    return {
      success: false,
      status: 500,
      message: 'Failed to create booking',
    };
  }
}

async function getBookingsByShow(showId) {
  const listKey = showBookingsKey(showId);
  const cached = getCache(listKey);

  if (cached) {
    return cached;
  }

  const bookings = await prisma.booking.findMany({
    where: { showId },
    include: {
      user: { select: { id: true, name: true } },
      seat: { select: { id: true, number: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  setCache(listKey, bookings);
  return bookings;
}

async function updateBooking(bookingId, { userId, seatId, showId }) {
  try {
    const existing = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, showId: true },
    });

    if (!existing) {
      return {
        success: false,
        status: 404,
        message: 'Booking not found',
      };
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        userId: userId ?? undefined,
        seatId: seatId ?? undefined,
        showId: showId ?? undefined,
      },
      include: {
        user: { select: { id: true, name: true } },
        seat: { select: { id: true, number: true } },
      },
    });

    invalidateBookingCaches(updated.id, existing.showId);
    invalidateBookingCaches(updated.id, updated.showId);
    setCache(bookingKey(updated.id), updated);

    return { success: true, status: 200, booking: updated };
  } catch (err) {
    if (err?.code === 'P2002') {
      return {
        success: false,
        status: 409,
        message: 'Seat already booked for this show',
      };
    }

    return {
      success: false,
      status: 500,
      message: 'Failed to update booking',
    };
  }
}

async function deleteBooking(bookingId) {
  try {
    const booking = await prisma.booking.delete({
      where: { id: bookingId },
      select: { id: true, showId: true },
    });

    invalidateBookingCaches(booking.id, booking.showId);

    return { success: true, status: 204 };
  } catch (err) {
    if (err?.code === 'P2025') {
      return {
        success: false,
        status: 404,
        message: 'Booking not found',
      };
    }

    return {
      success: false,
      status: 500,
      message: 'Failed to delete booking',
    };
  }
}

module.exports = {
  createBooking,
  getBookingsByShow,
  updateBooking,
  deleteBooking,
};