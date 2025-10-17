const express = require('express');
const EquipmentRequest = require('../models/EquipmentRequest');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all requests (Admin)
router.get('/', auth, async (req, res) => {
  try {
    const requests = await EquipmentRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get player's team requests
router.get('/my-requests/:playerName', auth, async (req, res) => {
  try {
    const requests = await EquipmentRequest.find({ 
      playerName: req.params.playerName 
    }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit equipment request
router.post('/', auth, async (req, res) => {
  try {
    const request = new EquipmentRequest(req.body);
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update request status (Admin)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const request = await EquipmentRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    request.adminNotes = adminNotes;
    await request.save();
    
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Issue equipment for approved request
router.put('/:id/issue', auth, async (req, res) => {
  try {
    const { itemId } = req.body;
    const request = await EquipmentRequest.findById(req.params.id);
    const Item = require('../models/Item');
    const Issue = require('../models/Issue');
    
    if (!request || request.status !== 'approved') {
      return res.status(400).json({ message: 'Request not approved' });
    }

    const item = await Item.findById(itemId);
    if (!item || item.quantity <= 0) {
      return res.status(400).json({ message: 'Item not available' });
    }

    // Create issue record
    const issue = new Issue({
      itemId,
      playerName: request.playerName,
      teamName: request.teamName,
      expectedReturnDate: request.expectedDate
    });
    await issue.save();

    // Update item quantity
    item.quantity -= 1;
    await item.save();

    // Update request status
    request.status = 'issued';
    request.issuedItemId = itemId;
    await request.save();
    
    res.json({ request, issue });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;