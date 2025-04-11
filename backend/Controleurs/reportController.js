const db = require('../config/db');
const { generatePDFReport, generateCSVReport } = require('../utils/reportGenerator');

class ReportController {
  static async getPlatformStats(req, res) {
    try {
      // Statistiques des utilisateurs
      const [users] = await db.promise().query(`
        SELECT 
          COUNT(*) as totalUsers,
          SUM(point) as totalPoints,
          AVG(point) as avgPoints,
          COUNT(CASE WHEN estVerifie = 1 THEN 1 END) as verifiedUsers
        FROM utilisateur
      `);
      
      // Statistiques des objets connectés
      const [objects] = await db.promise().query(`
        SELECT 
          COUNT(*) as totalObjects,
          GROUP_CONCAT(DISTINCT nom) as objectNames
        FROM objet_connecte
      `);
      
      // Activité récente
      const [recentActivity] = await db.promise().query(`
        SELECT action, COUNT(*) as count
        FROM logs
        WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY action
        ORDER BY count DESC
        LIMIT 5
      `);
      
      res.json({
        users: users[0],
        objects: objects[0],
        recentActivity
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getUserActivityReport(req, res) {
    try {
      const format = req.query.format || 'json';
      const { userId } = req.params;
      
      const [logs] = await db.promise().query(`
        SELECT * FROM logs 
        WHERE userId = ?
        ORDER BY timestamp DESC
      `, [userId]);
      
      if (format === 'pdf') {
        const pdf = await generatePDFReport(logs, `Rapport d'activité - Utilisateur ${userId}`);
        res.contentType('application/pdf');
        res.send(pdf);
      } else if (format === 'csv') {
        const csv = await generateCSVReport(logs);
        res.contentType('text/csv');
        res.attachment(`rapport-utilisateur-${userId}.csv`);
        res.send(csv);
      } else {
        res.json(logs);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getEnergyConsumptionReport(req, res) {
    try {
      // Cette requête suppose qu'il existe une table de consommation énergétique
      const [consumption] = await db.promise().query(`
        SELECT 
          DATE(timestamp) as date,
          SUM(energy_consumed) as total_energy
        FROM energy_consumption
        WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(timestamp)
        ORDER BY date DESC
      `);
      
      res.json(consumption);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = ReportController;
