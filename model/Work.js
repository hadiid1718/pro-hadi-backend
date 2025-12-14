const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Mern Stack', 'Frontend', 'Backend', 'Full Stack', 'Mobile', 'Other'],
    default: 'Full Stack'
  },
  technologies: [
    {
      type: String,
      required: true
    }
  ],
  metrics: [
    {
      type: String
    }
  ],
  status: {
    type: String,
    enum: ['Complete', 'Working', 'Planning', 'On Hold'],
    default: 'Complete'
  },
  value: {
    type: String,
    trim: true
  },
  hostedUrl: {
    type: String,
    trim: true
  },
  hosted: {
    type: String,
    enum: ['Yes', 'No'],
    default: 'No'
  },
  gradient: {
    type: String,
    default: 'from-blue-500 to-purple-600'
  },
  imageUrl: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Work', workSchema);
