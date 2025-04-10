const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. Ajouter un nouvel objet connecté
router.post('/ajouter', (req, res) => {
  const { nom, statut, outils, idPlateforme } = req.body;
  db.query(
    'INSERT INTO objet_connecte (nom, description, statut, outils, idPlateforme) VALUES (?, ?, ?, ?, ?)',
    [nom, description, statut, JSON.stringify(outils), idPlateforme],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur', error: err });
      res.status(201).json({ message: 'Objet ajouté avec succès' });
    }
  );
});

// 2. Modifier un objet connecté
router.put('/modifier/:id', (req, res) => {
  const { id } = req.params;
  const { nom, description, statut, outils } = req.body;
  db.query(
    'UPDATE objet_connecte SET nom = ?, description = ?, statut = ?, outils = ? WHERE idObjetConnecte = ?',
    [nom, description, statut, JSON.stringify(outils), id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur', error: err });
      res.status(200).json({ message: 'Objet modifié avec succès' });
    }
  );
});

// 3. Supprimer un objet connecté
router.delete('/supprimer/:id', (req, res) => {
  const { id } = req.params;
  db.query(
    'DELETE FROM objet_connecte WHERE idObjetConnecte = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur', error: err });
      res.status(200).json({ message: 'Objet supprimé avec succès' });
    }
  );
});

// 4. Contrôler l'état d'un objet connecté
router.patch('/etat/:id', (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;
  db.query(
    'UPDATE objet_connecte SET statut = ? WHERE idObjetConnecte = ?',
    [statut, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur', error: err });
      res.status(200).json({ message: `Objet ${statut === 'actif' ? 'activé' : 'désactivé'} avec succès` });
    }
  );
});

// 5. Associer un objet à une zone
router.patch('/associerZone/:id', (req, res) => {
  const { id } = req.params;
  const { zone } = req.body;
  db.query(
    'UPDATE objet_connecte SET zone = ? WHERE idObjetConnecte = ?',
    [zone, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur', error: err });
      res.status(200).json({ message: `Objet associé à la zone ${zone}` });
    }
  );
});

// 6. Configurer un objet
router.patch('/configurer/:id', (req, res) => {
  const { id } = req.params;
  const { configuration } = req.body;
  db.query(
    'UPDATE objet_connecte SET outils = ? WHERE idObjetConnecte = ?',
    [JSON.stringify(configuration), id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur', error: err });
      res.status(200).json({ message: 'Configuration mise à jour avec succès' });
    }
  );
});

// 7. Récupérer tous les objets connectés
router.get('/', (req, res) => {
  db.query('SELECT * FROM objet_connecte', (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur', error: err });
    res.status(200).json(result);
  });
});

module.exports = router;

