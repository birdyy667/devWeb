const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');
const authenticateAdmin = require('../middlewares/adminAuth');

// Rapports
router.get('/stats', authenticateAdmin, ReportController.getPlatformStats);
router.get('/user-activity/:userId', authenticateAdmin, ReportController.getUserActivityReport);
router.get('/energy-consumption', authenticateAdmin, ReportController.getEnergyConsumptionReport);

module.exports = router;
