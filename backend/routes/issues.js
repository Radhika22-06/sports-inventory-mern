const express = require('express');
const Issue = require('../models/Issue');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all issues (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    const issues = await Issue.find().populate('itemId').sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get player's issues
router.get('/my-issues/:playerName', auth, async (req, res) => {
  try {
    const issues = await Issue.find({ 
      playerName: req.params.playerName 
    }).populate('itemId').sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Player return request
router.put('/:id/return-request', auth, async (req, res) => {
  try {
    const { notes } = req.body;
    
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    issue.status = 'return-requested';
    issue.returnRequestDate = new Date();
    issue.notes = notes || 'Player wants to return this item';

    await issue.save();
    const populatedIssue = await Issue.findById(issue._id).populate('itemId');
    res.json(populatedIssue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Issue item
router.post('/', auth, async (req, res) => {
  try {
    const { itemId, playerName, teamName, expectedReturnDate } = req.body;
    
    const item = await Item.findById(itemId);
    if (!item || item.quantity <= 0) {
      return res.status(400).json({ message: 'Item not available' });
    }

    const issue = new Issue({
      itemId,
      playerName,
      teamName,
      expectedReturnDate
    });

    await issue.save();
    
    // Decrease item quantity
    item.quantity -= 1;
    await item.save();

    const populatedIssue = await Issue.findById(issue._id).populate('itemId');
    res.status(201).json(populatedIssue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Return item
router.put('/:id/return', auth, async (req, res) => {
  try {
    const { returnDate, returnCondition, fine, notes } = req.body;
    
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    issue.returnDate = returnDate ? new Date(returnDate) : new Date();
    issue.returnCondition = returnCondition;
    issue.fine = fine || 0;
    issue.status = 'returned';
    issue.notes = notes;

    await issue.save();

    // Increase item quantity if not lost
    if (returnCondition !== 'lost') {
      const item = await Item.findById(issue.itemId);
      item.quantity += 1;
      await item.save();
    }

    const populatedIssue = await Issue.findById(issue._id).populate('itemId');
    res.json(populatedIssue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;