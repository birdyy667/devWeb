const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const authenticateAdmin = require('../middlewares/adminAuth');

// Authentification admin
router.post('/login', AdminController.login);

// Gestion des utilisateurs
router.get('/users', authenticateAdmin, AdminController.getAllUsers);
router.get('/users/:id', authenticateAdmin, AdminController.getUser);
router.put('/users/:id', authenticateAdmin, AdminController.updateUser);
router.delete('/users/:id', authenticateAdmin, AdminController.deleteUser);
router.put('/users/:id/points', authenticateAdmin, AdminController.updateUserPoints);

// Logs
router.get('/logs', authenticateAdmin, AdminController.getLogs);
router.get('/logs/user/:userId', authenticateAdmin, AdminController.getUserLogs);

// Sauvegarde
router.get('/backup', authenticateAdmin, AdminController.backup);

module.exports = router;
