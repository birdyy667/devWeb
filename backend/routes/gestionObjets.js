const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. Ajouter un nouvel objet connecté
router.post('/ajouter', (req, res) => {
  const { nom, statut, outils, idPlateforme } = req.body;

  if (!nom || typeof statut === 'undefined' || !outils || !idPlateforme) {
    return res.status(400).json({ message: 'Champs requis manquants ou invalides' });
  }

  let outilsString;
  try {
    outilsString = JSON.stringify(outils); // outils doit être un objet ou array
  } catch (err) {
    return res.status(400).json({ message: 'Format JSON outils invalide', error: err });
  }

  db.query(
    'INSERT INTO objet_connecte (nom, statut, outils, idPlateforme) VALUES (?, ?, ?, ?)',
    [nom, statut, outilsString, idPlateforme],
    (err, result) => {
      if (err) {
        console.error("Erreur SQL :", err);
        return res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'objet', error: err });
      }
      res.status(201).json({ message: 'Objet ajouté avec succès' });
    }
  );
});


// 2. Modifier un objet connecté
router.put('/modifier/:id', (req, res) => {
  const { id } = req.params;
  const { nom, statut, outils } = req.body;

  // Vérification si l'objet existe
  db.query('SELECT * FROM objet_connecte WHERE idObjetConnecte = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la recherche de l\'objet', error: err });
    if (result.length === 0) {
      return res.status(404).json({ message: 'Objet non trouvé' });
    }

    // Si l'objet existe, on effectue la modification
    db.query(
      'UPDATE objet_connecte SET nom = ?, statut = ?, outils = ? WHERE idObjetConnecte = ?',
      [nom, statut, JSON.stringify(outils), id],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la modification de l\'objet', error: err });
        res.status(200).json({ message: 'Objet modifié avec succès' });
      }
    );
  });
});

// 3. Supprimer un objet connecté
router.delete('/supprimer/:id', (req, res) => {
  const { id } = req.params;

  // Vérification si l'objet existe
  db.query('SELECT * FROM objet_connecte WHERE idObjetConnecte = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la recherche de l\'objet', error: err });
    if (result.length === 0) {
      return res.status(404).json({ message: 'Objet non trouvé' });
    }

    // Si l'objet existe, on le supprime
    db.query(
      'DELETE FROM objet_connecte WHERE idObjetConnecte = ?',
      [id],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la suppression de l\'objet', error: err });
        res.status(200).json({ message: 'Objet supprimé avec succès' });
      }
    );
  });
});

// 4. Contrôler l'état d'un objet connecté
router.patch('/etat/:id', (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  // Vérification si l'objet existe
  db.query('SELECT * FROM objet_connecte WHERE idObjetConnecte = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la recherche de l\'objet', error: err });
    if (result.length === 0) {
      return res.status(404).json({ message: 'Objet non trouvé' });
    }

    // Mise à jour de l'état de l'objet
    db.query(
      'UPDATE objet_connecte SET statut = ? WHERE idObjetConnecte = ?',
      [statut, id],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'état', error: err });
        res.status(200).json({ message: `Objet ${statut === 'actif' ? 'activé' : 'désactivé'} avec succès` });
      }
    );
  });
});

// 5. Associer un objet à une zone
router.patch('/associerZone/:id', (req, res) => {
  const { id } = req.params;
  const { zone } = req.body;

  // Vérification si l'objet existe
  db.query('SELECT * FROM objet_connecte WHERE idObjetConnecte = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la recherche de l\'objet', error: err });
    if (result.length === 0) {
      return res.status(404).json({ message: 'Objet non trouvé' });
    }

    // Mise à jour de l'association avec la zone
    db.query(
      'UPDATE objet_connecte SET zone = ? WHERE idObjetConnecte = ?',
      [zone, id],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de l\'association avec la zone', error: err });
        res.status(200).json({ message: `Objet associé à la zone ${zone}` });
      }
    );
  });
});

// 6. Configurer un objet
router.patch('/configurer/:id', (req, res) => {
  const { id } = req.params;
  const { configuration } = req.body;

  // Vérification si l'objet existe
  db.query('SELECT * FROM objet_connecte WHERE idObjetConnecte = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la recherche de l\'objet', error: err });
    if (result.length === 0) {
      return res.status(404).json({ message: 'Objet non trouvé' });
    }

    // Mise à jour de la configuration
    db.query(
      'UPDATE objet_connecte SET outils = ? WHERE idObjetConnecte = ?',
      [JSON.stringify(configuration), id],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la configuration de l\'objet', error: err });
        res.status(200).json({ message: 'Configuration mise à jour avec succès' });
      }
    );
  });
});

// 7. Récupérer tous les objets connectés
router.get('/', (req, res) => {
  db.query('SELECT * FROM objet_connecte', (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des objets', error: err });
    res.status(200).json(result);
  });
});

module.exports = router;
