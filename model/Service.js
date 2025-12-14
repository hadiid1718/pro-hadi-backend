const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    features: {
      type: [String],
      default: []
    },
    technologies: {
      type: [String],
      default: []
    },
    icon: {
      type: String,
      default: null
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
