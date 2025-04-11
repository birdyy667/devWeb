const User = require('../models/User');
const Log = require('../models/Log');
const { backupDatabase } = require('../utils/backup');
const { ADMIN_CREDENTIALS } = require('../config/adminAuth');

class AdminController {
  static async login(req, res) {
    const { username, password } = req.body;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Enregistrer le log de connexion
      await Log.create({
        action: 'admin_login',
        description: `Connexion de l'administrateur ${username}`,
        userId: null
      });
      
      return res.json({ message: 'Connexion réussie', token: 'admin-token' });
    }
    
    return res.status(401).json({ error: 'Identifiants incorrects' });
  }

  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      
      // Vérifier si l'utilisateur existe
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
      
      // Mettre à jour l'utilisateur
      await User.update(id, data);
      
      // Enregistrer le log
      await Log.create({
        action: 'update_user',
        description: `Mise à jour de l'utilisateur ${id} par l'admin`,
        userId: req.adminId
      });
      
      res.json({ message: 'Utilisateur mis à jour avec succès' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      // Vérifier si l'utilisateur existe
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
      
      // Supprimer l'utilisateur
      await User.delete(id);
      
      // Enregistrer le log
      await Log.create({
        action: 'delete_user',
        description: `Suppression de l'utilisateur ${id} par l'admin`,
        userId: req.adminId
      });
      
      res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateUserPoints(req, res) {
    try {
      const { id } = req.params;
      const { points } = req.body;
      
      if (isNaN(points)) {
        return res.status(400).json({ error: 'Points doit être un nombre' });
      }
      
      // Mettre à jour les points
      await User.updatePoints(id, points);
      
      // Enregistrer le log
      await Log.create({
        action: 'update_points',
        description: `Mise à jour des points de l'utilisateur ${id} à ${points} par l'admin`,
        userId: req.adminId
      });
      
      res.json({ message: 'Points mis à jour avec succès' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getLogs(req, res) {
    try {
      const logs = await Log.findAll();
      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getUserLogs(req, res) {
    try {
      const logs = await Log.findByUserId(req.params.userId);
      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async backup(req, res) {
    try {
      const backupFile = await backupDatabase();
      res.download(backupFile);
      
      // Enregistrer le log
      await Log.create({
        action: 'database_backup',
        description: 'Sauvegarde de la base de données',
        userId: req.adminId
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = AdminController;
