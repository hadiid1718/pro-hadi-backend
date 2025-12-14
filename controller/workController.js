const Work = require('../model/Work');

// Create new work/project
exports.createWork = async (req, res) => {
  try {
    const { title, description, category, technologies, metrics, status, value, hostedUrl, hosted, gradient, imageUrl, featured } = req.body;

    // Validation
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description, and category are required' });
    }

    // Create new work
    const work = new Work({
      title,
      description,
      category,
      technologies: Array.isArray(technologies) ? technologies : [technologies],
      metrics: Array.isArray(metrics) ? metrics : [metrics],
      status,
      value,
      hostedUrl,
      hosted,
      gradient,
      imageUrl,
      featured
    });

    await work.save();
    console.log(`[createWork] Created work: ${work._id} - ${title}`);

    res.status(201).json({
      message: 'Work/Project created successfully',
      work
    });
  } catch (error) {
    console.error('Create work error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all works/projects
exports.getAllWorks = async (req, res) => {
  try {
    const works = await Work.find().sort({ order: 1, createdAt: -1 });
    console.log(`[getAllWorks] Found ${works.length} works`);

    res.status(200).json({
      message: 'Works fetched successfully',
      count: works.length,
      works
    });
  } catch (error) {
    console.error('Get all works error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single work by ID
exports.getWorkById = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);

    if (!work) {
      return res.status(404).json({ message: 'Work not found' });
    }

    res.status(200).json({
      message: 'Work fetched successfully',
      work
    });
  } catch (error) {
    console.error('Get work by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get featured works
exports.getFeaturedWorks = async (req, res) => {
  try {
    const works = await Work.find({ featured: true }).sort({ order: 1 });
    console.log(`[getFeaturedWorks] Found ${works.length} featured works`);

    res.status(200).json({
      message: 'Featured works fetched successfully',
      count: works.length,
      works
    });
  } catch (error) {
    console.error('Get featured works error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get works by category
exports.getWorksByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const works = await Work.find({ category }).sort({ order: 1, createdAt: -1 });
    console.log(`[getWorksByCategory] Found ${works.length} works in ${category}`);

    res.status(200).json({
      message: `Works in category ${category} fetched successfully`,
      count: works.length,
      works
    });
  } catch (error) {
    console.error('Get works by category error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update work
exports.updateWork = async (req, res) => {
  try {
    const { title, description, category, technologies, metrics, status, value, hostedUrl, hosted, gradient, imageUrl, featured, order } = req.body;

    let work = await Work.findById(req.params.id);
    if (!work) {
      return res.status(404).json({ message: 'Work not found' });
    }

    // Update fields
    if (title) work.title = title;
    if (description) work.description = description;
    if (category) work.category = category;
    if (technologies) work.technologies = Array.isArray(technologies) ? technologies : [technologies];
    if (metrics) work.metrics = Array.isArray(metrics) ? metrics : [metrics];
    if (status) work.status = status;
    if (value) work.value = value;
    if (hostedUrl) work.hostedUrl = hostedUrl;
    if (hosted) work.hosted = hosted;
    if (gradient) work.gradient = gradient;
    if (imageUrl) work.imageUrl = imageUrl;
    if (featured !== undefined) work.featured = featured;
    if (order !== undefined) work.order = order;
    
    work.updatedAt = Date.now();

    await work.save();
    console.log(`[updateWork] Updated work: ${work._id}`);

    res.status(200).json({
      message: 'Work updated successfully',
      work
    });
  } catch (error) {
    console.error('Update work error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete work
exports.deleteWork = async (req, res) => {
  try {
    const work = await Work.findByIdAndDelete(req.params.id);

    if (!work) {
      return res.status(404).json({ message: 'Work not found' });
    }

    console.log(`[deleteWork] Deleted work: ${work._id}`);

    res.status(200).json({
      message: 'Work deleted successfully',
      work
    });
  } catch (error) {
    console.error('Delete work error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get work statistics
exports.getWorkStats = async (req, res) => {
  try {
    const totalWorks = await Work.countDocuments();
    const completedWorks = await Work.countDocuments({ status: 'Complete' });
    const workingWorks = await Work.countDocuments({ status: 'Working' });
    const featuredWorks = await Work.countDocuments({ featured: true });

    // Get category distribution
    const categories = await Work.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      message: 'Work statistics fetched successfully',
      stats: {
        totalWorks,
        completedWorks,
        workingWorks,
        featuredWorks,
        categories
      }
    });
  } catch (error) {
    console.error('Get work stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
