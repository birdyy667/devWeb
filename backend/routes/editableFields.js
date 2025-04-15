// 📁 routes/editableFields.js

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Configuration des champs modifiables selon le type d'objet
const editableFields = {
  "Compteur électrique": ["courant", "tension", "emplacement"],
  "Thermostat connecté": ["temperature_int", "temperature_ext", "hygrometrie", "emplacement"],
  "Escalator connecté": ["vitesse_m_s", "sens", "etat", "emplacement"],
  "Caméra connectée": ["etat_enregistrement", "stockage_disponible", "emplacement"],
  "Lumière connectée": ["etat", "mode", "luminosite", "emplacement"],
  "Alarme intrusion": ["etat", "niveau_alerte", "emplacement"] // ✅ Ajouté ici
};

// GET : Liste des champs modifiables pour un type donné
router.get('/champs-editables/:type', (req, res) => {
  const { type } = req.params;
  const champs = editableFields[type];
  if (!champs) return res.status(404).json({ error: "Type d'objet non reconnu" });
  res.json(champs);
});

// PUT : Mise à jour des champs modifiables dans la bonne table
router.put('/objets-connectes/:id', (req, res) => {
  const { id } = req.params;
  const { typeObjet, donnees } = req.body;

  const champsAutorises = editableFields[typeObjet];
  if (!champsAutorises) return res.status(400).json({ error: "Type d'objet non pris en charge" });

  const donneesFiltrees = {};
  champsAutorises.forEach(champ => {
    if (donnees[champ] !== undefined) {
      donneesFiltrees[champ] = donnees[champ];
    }
  });

  if (Object.keys(donneesFiltrees).length === 0) {
    return res.status(400).json({ error: "Aucune donnée modifiable fournie" });
  }

  const table = typeObjet.toLowerCase().replace(/ /g, "_").normalize("NFD").replace(/[̀-ͯ]/g, "");
  const setClause = Object.keys(donneesFiltrees).map(key => `${key} = ?`).join(", ");
  const values = Object.values(donneesFiltrees);

  const sql = `UPDATE ${table} SET ${setClause} WHERE idObjetConnecte = ?`;

  db.query(sql, [...values, id], (err, result) => {
    if (err) {
      console.error("❌ Erreur SQL :", err);
      return res.status(500).json({ error: "Erreur lors de la mise à jour" });
    }
    res.json({ success: true });
  });
});

module.exports = router;
