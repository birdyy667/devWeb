const express = require('express');
const router = express.Router();
const ObjectController = require('../controllers/objectController');
const authenticateAdmin = require('../middlewares/adminAuth');

// Gestion des objets connectés
router.get('/', authenticateAdmin, ObjectController.getAllObjects);
router.post('/', authenticateAdmin, ObjectController.createObject);
router.put('/:id', authenticateAdmin, ObjectController.updateObject);
router.delete('/:id', authenticateAdmin, ObjectController.deleteObject);

module.exports = router;
