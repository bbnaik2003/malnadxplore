const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  activities: { type: String, required: true },
  time: { type: String, default: '' },
}, { _id: false });

const travelerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 1, max: 100 },
  contact: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
}, { _id: false });

const tripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Trip title is required'],
    trim: true,
    maxlength: [120, 'Title too long'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description too long'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  duration: {
    type: Number,
    min: [1, 'Duration must be at least 1 day'],
  },
  maxTravelers: {
    type: Number,
    default: 20,
    min: [1, 'Must allow at least 1 traveler'],
  },
  images: [{ type: String }],
  documents: [{ type: String }],
  tags: [{ type: String, trim: true }],
  schedule: [scheduleSchema],
  travelers: [travelerSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Virtual: spots left
tripSchema.virtual('spotsLeft').get(function () {
  return this.maxTravelers - this.travelers.length;
});

// Index for search
tripSchema.index({ title: 'text', location: 'text', description: 'text' });

module.exports = mongoose.model('Trip', tripSchema);
