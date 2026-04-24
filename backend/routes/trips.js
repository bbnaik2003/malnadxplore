const express = require('express');
const Trip = require('../models/Trip');
const User = require('../models/User');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @GET /api/trips — list with search, filter, sort, pagination
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, minPrice, maxPrice, duration, sort, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (duration) query.duration = Number(duration);

    // Sort options
    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      duration_asc: { duration: 1 },
      popular: { 'travelers.length': -1 },
    };
    const sortOption = sortMap[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [trips, total] = await Promise.all([
      Trip.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .populate('createdBy', 'name'),
      Trip.countDocuments(query),
    ]);

    res.json({ trips, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
});

// @GET /api/trips/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('travelers.user', 'name email');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trip' });
  }
});

// @POST /api/trips — admin only
router.post('/',
  protect, adminOnly,
  upload.fields([{ name: 'images', maxCount: 10 }, { name: 'documents', maxCount: 5 }]),
  async (req, res) => {
    try {
      const { title, location, description, price, duration, maxTravelers, tags, schedule } = req.body;

      if (!title || !location || !price) {
        return res.status(400).json({ message: 'Title, location, and price are required' });
      }

      const images = req.files?.images?.map(f => f.filename) || [];
      const documents = req.files?.documents?.map(f => f.filename) || [];
      const parsedTags = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const parsedSchedule = schedule ? JSON.parse(schedule) : [];

      const trip = await Trip.create({
        title: title.trim(),
        location: location.trim(),
        description: description?.trim(),
        price: Number(price),
        duration: duration ? Number(duration) : undefined,
        maxTravelers: maxTravelers ? Number(maxTravelers) : 20,
        images,
        documents,
        tags: parsedTags,
        schedule: parsedSchedule,
        createdBy: req.user._id,
      });

      res.status(201).json(trip);
    } catch (err) {
      console.error('Create trip error:', err);
      res.status(500).json({ message: err.message || 'Failed to create trip' });
    }
  }
);

// @PUT /api/trips/:id — admin only
router.put('/:id',
  protect, adminOnly,
  upload.fields([{ name: 'images', maxCount: 10 }, { name: 'documents', maxCount: 5 }]),
  async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.id);
      if (!trip) return res.status(404).json({ message: 'Trip not found' });

      const { title, location, description, price, duration, maxTravelers, tags, schedule } = req.body;
      const updates = {};

      if (title) updates.title = title.trim();
      if (location) updates.location = location.trim();
      if (description !== undefined) updates.description = description.trim();
      if (price) updates.price = Number(price);
      if (duration) updates.duration = Number(duration);
      if (maxTravelers) updates.maxTravelers = Number(maxTravelers);
      if (tags !== undefined) updates.tags = tags.split(',').map(t => t.trim()).filter(Boolean);
      if (schedule) updates.schedule = JSON.parse(schedule);

      // Append new files
      if (req.files?.images?.length) {
        updates.images = [...trip.images, ...req.files.images.map(f => f.filename)];
      }
      if (req.files?.documents?.length) {
        updates.documents = [...trip.documents, ...req.files.documents.map(f => f.filename)];
      }

      const updated = await Trip.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: 'Update failed' });
    }
  }
);

// @DELETE /api/trips/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

// @POST /api/trips/:id/join — authenticated user
router.post('/:id/join', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    // Check already joined
    const alreadyJoined = trip.travelers.some(t => t.user?.toString() === req.user._id.toString());
    if (alreadyJoined) return res.status(400).json({ message: 'You already joined this trip' });

    // Check capacity
    if (trip.travelers.length >= trip.maxTravelers) {
      return res.status(400).json({ message: 'Trip is fully booked' });
    }

    const { name, age, contact } = req.body;
    if (!name || !age || !contact) {
      return res.status(400).json({ message: 'Name, age, and contact are required' });
    }

    trip.travelers.push({ user: req.user._id, name, age: Number(age), contact });
    await trip.save();

    // Update user's joined trips
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { joinedTrips: trip._id },
    });

    res.json({ message: 'Successfully joined the trip!', trip });
  } catch (err) {
    res.status(500).json({ message: 'Failed to join trip' });
  }
});

// @POST /api/trips/:id/leave
router.post('/:id/leave', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    trip.travelers = trip.travelers.filter(t => t.user?.toString() !== req.user._id.toString());
    await trip.save();

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { joinedTrips: trip._id },
    });

    res.json({ message: 'Left the trip successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to leave trip' });
  }
});

// @GET /api/trips/:id/travelers
router.get('/:id/travelers', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('travelers.user', 'name email avatar');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip.travelers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch travelers' });
  }
});

module.exports = router;
