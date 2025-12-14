const Contact = require('../model/Contact');

// Create a new contact message
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new contact
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message
    });

    await contact.save();

    res.status(201).json({
      message: 'Contact message sent successfully',
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject
      }
    });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all contact messages (admin only)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    console.log(`[getAllContacts] Found ${contacts.length} contacts`);
    
    res.status(200).json({
      message: 'Contacts fetched successfully',
      count: contacts.length,
      contacts
    });
  } catch (error) {
    console.error('Get all contacts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single contact by ID
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Mark as read
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    res.status(200).json({
      message: 'Contact fetched successfully',
      contact
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update contact status (admin only)
exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['new', 'read', 'responded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    let contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    contact.status = status;
    await contact.save();

    res.status(200).json({
      message: 'Contact status updated successfully',
      contact
    });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete contact (admin only)
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get contact statistics (admin only)
exports.getContactStats = async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const newContacts = await Contact.countDocuments({ status: 'new' });
    const readContacts = await Contact.countDocuments({ status: 'read' });
    const respondedContacts = await Contact.countDocuments({ status: 'responded' });

    res.status(200).json({
      message: 'Contact statistics fetched successfully',
      stats: {
        totalContacts,
        newContacts,
        readContacts,
        respondedContacts
      }
    });
  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Send reply to a contact message (admin only)
exports.sendReply = async (req, res) => {
  try {
    const contactId = req.params.id;
    const { message, adminName, adminEmail } = req.body;

    // Validation
    if (!contactId || !message) {
      return res.status(400).json({ message: 'Contact ID and message are required' });
    }

    // Find contact and add reply
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Add reply to replies array
    contact.replies.push({
      adminName: adminName || 'Admin',
      adminEmail: adminEmail,
      message: message,
      sentAt: new Date()
    });

    // Update status to responded
    contact.status = 'responded';
    contact.updatedAt = new Date();

    await contact.save();

    res.status(200).json({
      message: 'Reply sent successfully',
      contact: {
        id: contact._id,
        status: contact.status,
        replies: contact.replies
      }
    });
  } catch (error) {
    console.error('Send reply error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get messages for a specific user (conversation history)
exports.getUserConversation = async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    console.log(`[getUserConversation] Fetching messages for email: ${userEmail}`);

    // Find all contacts from this email
    const contacts = await Contact.find({ email: userEmail }).sort({ createdAt: -1 });
    console.log(`[getUserConversation] Found ${contacts.length} messages for ${userEmail}`);

    res.status(200).json({
      message: 'User conversation fetched successfully',
      count: contacts.length,
      contacts
    });
  } catch (error) {
    console.error('Get user conversation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single contact with full details (for admin to view)
exports.getContactWithReplies = async (req, res) => {
  try {
    const { contactId } = req.params;

    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Mark as read if not already
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    res.status(200).json({
      message: 'Contact details fetched successfully',
      contact
    });
  } catch (error) {
    console.error('Get contact details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};