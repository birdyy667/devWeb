const express = require("express");
const router = express.Router();
const db = require('../config/db.js');

// ✅ Récupérer tous les objets connectés pour un utilisateur
router.get("/", (req, res) => {
  const { userId } = req.query;

  db.query(
    `SELECT o.*, b.nom AS nomBase, b.structureDonnees 
     FROM objet_connecte o
     LEFT JOIN base_donnees_associee b ON o.idBase = b.idBase
     WHERE o.ajoutePar = ? OR o.estValide = 1`,
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur de récupération" });
      res.json(result);
    }
  );
});

// ✅ Ajouter un objet connecté
router.post("/", (req, res) => {
  const { nom, description, typeObjet, idBase, idPlateforme, ajoutePar, emplacement } = req.body;

  if (!nom || !typeObjet || !idBase || !idPlateforme || !ajoutePar) {
    return res.status(400).json({ error: "Champs manquants." });
  }

  const sql = `
    INSERT INTO objet_connecte (nom, description, typeObjet, idBase, idPlateforme, ajoutePar, emplacement)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [nom, description || '', typeObjet, parseInt(idBase), parseInt(idPlateforme), parseInt(ajoutePar), emplacement],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur lors de l'insertion." });
      res.status(201).json({ message: "Objet ajouté", id: result.insertId });
    }
  );
});

// ✅ Modifier les métadonnées d’un objet (nom, description, etc.)
router.put("/objet/:id", (req, res) => {
  const { nom, description, typeObjet, idBase } = req.body;
  const { id } = req.params;

  db.query(
    `UPDATE objet_connecte SET nom=?, description=?, typeObjet=?, idBase=? WHERE idObjetConnecte=?`,
    [nom, description, typeObjet, idBase, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur de modification." });
      res.json({ success: true });
    }
  );
});

// ✅ Modifier les données dynamiques d’un objet (valeurs mesurées)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const champs = req.body;

  if (!champs || typeof champs !== "object") {
    return res.status(400).json({ error: "Corps invalide" });
  }

  db.query(
    "SELECT idDonnee FROM donnees_objet WHERE idObjetConnecte = ? ORDER BY dateCollecte DESC LIMIT 1",
    [id],
    (err, rows) => {
      if (err) {
        console.error("Erreur SELECT :", err);
        return res.status(500).json({ error: "Erreur serveur (SELECT)" });
      }

      if (rows.length > 0) {
        db.query(
          "UPDATE donnees_objet SET donnees = ?, dateCollecte = NOW() WHERE idDonnee = ?",
          [JSON.stringify(champs), rows[0].idDonnee],
          (err2) => {
            if (err2) {
              console.error("Erreur UPDATE :", err2);
              return res.status(500).json({ error: "Erreur serveur (UPDATE)" });
            }
            res.status(200).json({ message: "Mise à jour réussie (UPDATE)" });
          }
        );
      } else {
        db.query(
          "INSERT INTO donnees_objet (idObjetConnecte, donnees) VALUES (?, ?)",
          [id, JSON.stringify(champs)],
          (err3) => {
            if (err3) {
              console.error("Erreur INSERT :", err3);
              return res.status(500).json({ error: "Erreur serveur (INSERT)" });
            }
            res.status(200).json({ message: "Mise à jour réussie (INSERT)" });
          }
        );
      }
    }
  );
});


// ✅ Supprimer un objet
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    `DELETE FROM objet_connecte WHERE idObjetConnecte = ?`,
    [id],
    (err) => {
      if (err) return res.status(500).json({ error: "Erreur de suppression." });
      res.json({ success: true });
    }
  );
});

// ✅ Récupérer la dernière valeur enregistrée de chaque objet
router.get("/donnees", (req, res) => {
  const sql = `
    SELECT idObjetConnecte, donnees
    FROM donnees_objet
    WHERE dateCollecte IN (
      SELECT MAX(dateCollecte)
      FROM donnees_objet
      GROUP BY idObjetConnecte
    )
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ Erreur récupération données objet :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    const donneesMap = {};
    rows.forEach(row => {
      try {
        donneesMap[row.idObjetConnecte] = JSON.parse(row.donnees);
      } catch (parseErr) {
        console.warn(`⚠️ Erreur parsing JSON pour l'objet ${row.idObjetConnecte}`);
        donneesMap[row.idObjetConnecte] = {};
      }
    });

    res.json(donneesMap);
  });
});


// ✅ Liste des champs modifiables selon le type d'objet
router.get("/champs-editables/:typeObjet", (req, res) => {
  const { typeObjet } = req.params;

  const map = {
    "Thermostat connecté": ["temperature_cible", "mode", "emplacement"],
    "Escalator connecté": ["vitesse_m_s", "sens", "etat", "maintenance_prevue", "derniere_inspection", "emplacement"],
    "Caméra connectée": ["resolution", "etat_enregistrement", "emplacement"],
    "Lumière connectée": ["etat", "mode", "luminosite", "emplacement"],
    "Compteur électrique": ["courant", "tension", "emplacement"]
  };

  res.json(map[typeObjet] || []);
});

// ✅ Récupérer les bases de données associées
router.get("/bases-donnees", (req, res) => {
  db.query("SELECT idBase, nom, description FROM base_donnees_associee", (err, result) => {
    if (err) return res.status(500).json({ error: "Erreur serveur lors de la récupération des bases" });
    res.json(result);
  });
});

module.exports = router;
