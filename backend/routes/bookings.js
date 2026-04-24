const express = require('express');
const Trip = require('../models/Trip');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @GET /api/bookings/my — user's bookings
router.get('/my', protect, async (req, res) => {
  try {
    const trips = await Trip.find({
      'travelers.user': req.user._id,
    }).select('title location price duration images travelers');

    const bookings = trips.map(trip => {
      const traveler = trip.travelers.find(t => t.user?.toString() === req.user._id.toString());
      return {
        trip: {
          _id: trip._id,
          title: trip.title,
          location: trip.location,
          price: trip.price,
          duration: trip.duration,
          image: trip.images?.[0] || null,
        },
        traveler,
        joinedAt: traveler?.joinedAt,
      };
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// @GET /api/bookings/all — admin only
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const trips = await Trip.find()
      .select('title location price travelers')
      .populate('travelers.user', 'name email');

    const allBookings = [];
    trips.forEach(trip => {
      trip.travelers.forEach(traveler => {
        allBookings.push({
          trip: { _id: trip._id, title: trip.title, location: trip.location, price: trip.price },
          traveler,
        });
      });
    });

    // Sort newest first
    allBookings.sort((a, b) => new Date(b.traveler.joinedAt) - new Date(a.traveler.joinedAt));

    res.json({ bookings: allBookings, total: allBookings.length });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

module.exports = router;
