const Course = require('../model/Course');

// Create a new course (admin only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, instructor, duration, level, topics, price, image } = req.body;

    // Validation
    if (!title || !description || !category || !instructor) {
      return res.status(400).json({ message: 'Title, description, category, and instructor are required' });
    }

    const course = new Course({
      title,
      description,
      category,
      instructor,
      duration,
      level,
      topics: Array.isArray(topics) ? topics : [],
      price,
      image
    });

    await course.save();

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Courses fetched successfully',
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course fetched successfully',
      course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get courses by category
exports.getCoursesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const courses = await Course.find({ category }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Courses fetched successfully',
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error('Get courses by category error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update course (admin only)
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    let course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'description', 'category', 'instructor', 'duration', 'level', 'topics', 'price', 'image'];
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        course[key] = updates[key];
      }
    });

    course.updatedAt = Date.now();
    await course.save();

    res.status(200).json({
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete course (admin only)
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get course statistics (admin only)
exports.getCourseStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const coursesByLevel = await Course.aggregate([
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 }
        }
      }
    ]);

    const coursesByCategory = await Course.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      message: 'Course statistics fetched successfully',
      stats: {
        totalCourses,
        byLevel: coursesByLevel,
        byCategory: coursesByCategory
      }
    });
  } catch (error) {
    console.error('Get course stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
