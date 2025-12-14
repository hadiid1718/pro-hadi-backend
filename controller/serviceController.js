const Service = require('../model/Service');

// Create a new service (Admin only)
exports.createService = async (req, res) => {
  try {
    const { title, description, features, technologies, icon, order } = req.body;

    if (!title || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and description are required' 
      });
    }

    const newService = new Service({
      title,
      description,
      features: features || [],
      technologies: technologies || [],
      icon: icon || null,
      order: order || 0
    });

    await newService.save();
    console.log('[createService] Service created:', newService._id);

    res.status(201).json({ 
      success: true, 
      message: 'Service created successfully', 
      service: newService 
    });
  } catch (error) {
    console.error('[createService] Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating service', 
      error: error.message 
    });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    console.log('[getAllServices] Retrieved', services.length, 'services');

    res.status(200).json({ 
      success: true, 
      services 
    });
  } catch (error) {
    console.error('[getAllServices] Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching services', 
      error: error.message 
    });
  }
};

// Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ 
        success: false, 
        message: 'Service not found' 
      });
    }

    console.log('[getServiceById] Retrieved service:', id);
    res.status(200).json({ 
      success: true, 
      service 
    });
  } catch (error) {
    console.error('[getServiceById] Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching service', 
      error: error.message 
    });
  }
};

// Update service (Admin only)
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, features, technologies, icon, order } = req.body;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ 
        success: false, 
        message: 'Service not found' 
      });
    }

    // Update fields
    if (title) service.title = title;
    if (description) service.description = description;
    if (features) service.features = features;
    if (technologies) service.technologies = technologies;
    if (icon !== undefined) service.icon = icon;
    if (order !== undefined) service.order = order;

    await service.save();
    console.log('[updateService] Service updated:', id);

    res.status(200).json({ 
      success: true, 
      message: 'Service updated successfully', 
      service 
    });
  } catch (error) {
    console.error('[updateService] Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating service', 
      error: error.message 
    });
  }
};

// Delete service (Admin only)
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res.status(404).json({ 
        success: false, 
        message: 'Service not found' 
      });
    }

    console.log('[deleteService] Service deleted:', id);
    res.status(200).json({ 
      success: true, 
      message: 'Service deleted successfully' 
    });
  } catch (error) {
    console.error('[deleteService] Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting service', 
      error: error.message 
    });
  }
};

// Get service statistics
exports.getServiceStats = async (req, res) => {
  try {
    const totalServices = await Service.countDocuments();
    
    console.log('[getServiceStats] Total services:', totalServices);
    res.status(200).json({ 
      success: true, 
      stats: {
        totalServices
      }
    });
  } catch (error) {
    console.error('[getServiceStats] Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching service stats', 
      error: error.message 
    });
  }
};
