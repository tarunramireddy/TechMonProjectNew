const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const Activity = require('../models/Activity');

// Add new asset
router.post('/add', async (req, res) => {
  try {
    const asset = new Asset(req.body);
    const savedAsset = await asset.save();

    const activityData = {
      action: 'Add',
      description: `Added asset: ${savedAsset.name || savedAsset.serialNumber}`,
      serialNumber: savedAsset.serialNumber,
    };

    console.log('Logging activity:', activityData); // ✅ now this works

    await Activity.create(activityData); // ✅ save once, not twice

    res.status(201).json({ success: true, asset: savedAsset });
  } catch (error) {
    console.error('Error saving asset or logging activity:', error);
    res.status(500).json({ success: false, message: 'Failed to save asset' });
  }
});



// Update asset
router.put('/update/:id', async (req, res) => {
  console.log('Received update request for ID:', req.params.id);
  try {
    const updatedAsset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedAsset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    await Activity.create({
      action: 'Update',
      description: `Updated asset: ${updatedAsset.name || updatedAsset.serialNumber}`,
      serialNumber: updatedAsset.serialNumber
    });

    res.status(200).json({ success: true, asset: updatedAsset });
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({ success: false, message: 'Error updating asset', error });
  }
});




// Get all assets
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch assets' });
  }
});

// Delete asset
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedAsset = await Asset.findByIdAndDelete(req.params.id);
    if (!deletedAsset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    await Activity.create({
      action: 'Delete',
      description: `Deleted asset: ${deletedAsset.name || deletedAsset.serialNumber}`
    });

    res.json({ success: true, message: 'Asset deleted' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ success: false, message: 'Failed to delete asset' });
  }
});


// Count assets by status
router.get('/stats', async (req, res) => {
  try {
    const total = await Asset.countDocuments();
    const available = await Asset.countDocuments({ status: 'Available' });
    const assigned = await Asset.countDocuments({ status: 'Assigned' });
    const maintenance = await Asset.countDocuments({ status: 'Maintenance' });

    res.json({
      success: true,
      stats: {
        total,
        available,
        assigned,
        maintenance,
      },
    });
  } catch (error) {
    console.error('Error fetching asset stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});


router.get('/recent', async (req, res) => {
  try {
    const recentAssets = await Asset.find().sort({ createdAt: -1 }).limit(2);
    res.json({ success: true, recent: recentAssets });
  } catch (error) {
    console.error('Error fetching recent assets:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch recent assets' });
  }
});

router.get('/serial/:serialNumber', async (req, res) => {
  try {
    const serial = req.params.serialNumber;
    const asset = await Asset.findOne({ serialNumber: { $regex: new RegExp(`^${serial}$`, 'i') } });

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;
