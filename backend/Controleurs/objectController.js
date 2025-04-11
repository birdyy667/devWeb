const Object = require('../models/Object');
const Log = require('../models/Log');

class ObjectController {
  static async getAllObjects(req, res) {
    try {
      const objects = await Object.findAll();
      res.json(objects);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createObject(req, res) {
    try {
      const objectData = req.body;
      const result = await Object.create(objectData);
      
      // Enregistrer le log
      await Log.create({
        action: 'create_object',
        description: `Création d'un nouvel objet connecté: ${objectData.nom}`,
        userId: req.adminId
      });
      
      res.status(201).json({ 
        message: 'Objet créé avec succès',
        objectId: result.insertId
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateObject(req, res) {
    try {
      const { id } = req.params;
      const objectData = req.body;
      
      await Object.update(id, objectData);
      
      // Enregistrer le log
      await Log.create({
        action: 'update_object',
        description: `Mise à jour de l'objet connecté ${id}`,
        userId: req.adminId
      });
      
      res.json({ message: 'Objet mis à jour avec succès' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteObject(req, res) {
    try {
      const { id } = req.params;
      
      await Object.delete(id);
      
      // Enregistrer le log
      await Log.create({
        action: 'delete_object',
        description: `Suppression de l'objet connecté ${id}`,
        userId: req.adminId
      });
      
      res.json({ message: 'Objet supprimé avec succès' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = ObjectController;
