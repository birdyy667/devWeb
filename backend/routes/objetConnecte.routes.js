const express = require("express");
const router = express.Router();
const db = require('../config/db.js');

// ✅ Récupérer tous les objets connectés pour un utilisateur
router.get("/", async (req, res) => {
  const { userId } = req.query;

  db.query(
    `SELECT o.*, b.nom AS nomBase, b.structureDonnees 
     FROM objet_connecte o
     LEFT JOIN base_donnees_associee b ON o.idBase = b.idBase
     WHERE o.ajoutePar = ? OR o.estValide = 1`,
    [userId],
    async (err, objets) => {
      if (err) return res.status(500).json({ error: "Erreur de récupération" });

      const promises = objets.map(obj => {
        return new Promise((resolve) => {
          db.query(
            "SELECT donnees, dateCollecte FROM donnees_objet WHERE idObjetConnecte = ? ORDER BY dateCollecte DESC LIMIT 1",
            [obj.idObjetConnecte],
            (err2, rows) => {
              if (err2 || rows.length === 0) {
                obj.derniereDonnee = {};
              } else {
                try {
                  const donnees = typeof rows[0].donnees === "string"
                    ? JSON.parse(rows[0].donnees)
                    : rows[0].donnees;

                  obj.derniereDonnee = donnees;
                  obj.dateDerniereMaj = rows[0].dateCollecte;

                } catch (e) {
                  obj.derniereDonnee = {};
                }
              }
              resolve();
            }
          );
        });
      });

      await Promise.all(promises);
      res.json(objets);
    }
  );
});




// ✅ Ajouter un objet connecté
router.post("/", (req, res) => {
  const { nom, description, typeObjet, idPlateforme, ajoutePar, emplacement, estValide = 0 } = req.body;

  // Vérification des champs obligatoires
  if (!nom || !typeObjet || !idPlateforme || !ajoutePar) {
    return res.status(400).json({ error: "Champs manquants." });
  }

  // Recherche automatique de la base liée au type d'objet
  const sqlBase = `SELECT idBase FROM base_donnees_associee WHERE nom = ? LIMIT 1`;

  db.query(sqlBase, [typeObjet], (errBase, baseRows) => {
    if (errBase) {
      console.error("❌ Erreur lors de la récupération de la base :", errBase);
      return res.status(500).json({ error: "Erreur serveur (recherche base)." });
    }

    if (!baseRows || baseRows.length === 0) {
      return res.status(404).json({ error: "Aucune base associée trouvée pour ce type d'objet." });
    }

    const idBaseTrouve = baseRows[0].idBase;

    const sql = `
      INSERT INTO objet_connecte 
      (nom, description, typeObjet, idBase, idPlateforme, ajoutePar, emplacement,estValide)
      VALUES (?, ?, ?, ?, ?, ?, ?,?)
    `;

    const valeurs = [
      nom,
      description || '',
      typeObjet,
      idBaseTrouve,
      parseInt(idPlateforme),
      parseInt(ajoutePar),
      emplacement || "Non spécifié",
      parseInt(estValide)  // 👈 ici !
    ];

    db.query(sql, valeurs, (err, result) => {
      if (err) {
        console.error("❌ Erreur SQL insertion :", err);
        return res.status(500).json({ error: "Erreur lors de l'insertion." });
      }

      res.status(201).json({ message: "✅ Objet ajouté avec succès", id: result.insertId });
    });
  });
});




// ✅ Données dynamiques d’un seul objet connecté (avec parsing sécurisé)
router.get("/donnees/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT donnees FROM donnees_objet WHERE idObjetConnecte = ? ORDER BY dateCollecte DESC LIMIT 1",
    [id],
    (err, rows) => {
      if (err) {
        console.error("Erreur SQL :", err);
        return res.status(500).json({ error: "Erreur serveur SQL" });
      }

      if (rows.length === 0 || !rows[0].donnees) {
        console.warn(`Aucune donnée pour l'objet ${id}`);
        return res.json({});
      }

      try {
        const donnees = typeof rows[0].donnees === "string"
          ? JSON.parse(rows[0].donnees)
          : rows[0].donnees;

        res.json(donnees);
      } catch (e) {
        console.error(`Erreur parsing JSON pour l'objet ${id} :`, e);
        return res.status(500).json({ error: "Erreur de parsing JSON" });
      }
    }
  );
});



// ✅ Modifier les données dynamiques d’un objet (valeurs mesurées)
// ✅ Modifier les données dynamiques d’un objet (valeurs mesurées)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  let champs = req.body;

  if (!champs || typeof champs !== "object" || Array.isArray(champs)) {
    return res.status(400).json({ error: "Le corps de la requête est invalide" });
  }

  db.query(
    "SELECT typeObjet FROM objet_connecte WHERE idObjetConnecte = ?",
    [id],
    (errType, rowsType) => {
      if (errType || rowsType.length === 0) {
        console.error("❌ Erreur récupération type objet :", errType);
        return res.status(500).json({ error: "Erreur récupération type d'objet" });
      }

      const typeObjet = rowsType[0].typeObjet;

      const champsParType = {
        "Thermostat connecté": ["temperature_cible", "mode", "emplacement"],
        "Escalator connecté": ["vitesse_m_s", "sens", "etat", "maintenance_prevue", "derniere_inspection", "emplacement"],
        "Lumière connectée": ["etat", "mode", "luminosite", "emplacement"],
        "Compteur électrique": ["courant", "tension", "emplacement"]
      };

      const valeursParDefaut = {
        etat: "marche",
        mode: "auto",
        luminosite: 50,
        resolution: "1080p",
        temperature_cible: 20,
        courant: 5,
        tension: 220,
        vitesse_m_s: 1.5,
        sens: "montée",
        maintenance_prevue: "2 mois",
        derniere_inspection: "1 mois",
        emplacement: "Non spécifié"
      };

      const autorises = champsParType[typeObjet] || [];

      // 🔍 Nettoyage : on garde uniquement les champs autorisés
      champs = Object.fromEntries(
        Object.entries(champs)
          .filter(([key]) => autorises.includes(key))
          .map(([key, value]) => [
            key,
            value === undefined || value === "" || value === null
              ? valeursParDefaut[key]
              : value
          ])
      );

      const jsonData = JSON.stringify(champs);

      // ✅ Insertion systématique dans l'historique (aucune mise à jour)
      db.query(
        "INSERT INTO donnees_objet (idObjetConnecte, donnees) VALUES (?, ?)",
        [id, jsonData],
        (err3) => {
          if (err3) {
            console.error("❌ Erreur INSERT :", err3);
            return res.status(500).json({ error: "Erreur serveur lors de l'insertion" });
          }
          res.status(201).json({ message: "✅ Nouvelle donnée ajoutée (historique conservé)" });
        }
      );
    }
  );
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  // ✅ Liste des tables enfants
  const tablesDependantes = [
    "camera_connectee",
    "compteur_electrique",
    "eclairage_connecte",
    "escalator_connecte",
    "thermostat_connecte",
    "donnees_objet"
  ];

  try {
    // 🔁 Suppression dans les tables enfants
    for (const table of tablesDependantes) {
      await new Promise((resolve, reject) => {
        db.query(
          `DELETE FROM \`${table}\` WHERE idObjetConnecte = ?`,
          [id],
          (err) => {
            if (err) {
              console.error(`❌ Erreur suppression dans ${table} :`, err);
              return reject(`Erreur suppression dans la table ${table}`);
            }
            resolve();
          }
        );
      });
    }

    // ✅ Ensuite on supprime l’objet principal
    db.query(
      "DELETE FROM objet_connecte WHERE idObjetConnecte = ?",
      [id],
      (err) => {
        if (err) {
          console.error("❌ Erreur suppression objet_connecte :", err);
          return res.status(500).json({ error: "Erreur suppression objet_connecte" });
        }
        res.json({ success: true });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err });
  }
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

// ✅ Modifier les infos générales d’un objet connecté
router.put("/objet/:id", (req, res) => {
  const { id } = req.params;
  const { nom, description, typeObjet, idBase } = req.body;

  if (!nom || !typeObjet || !idBase) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  const sql = `
    UPDATE objet_connecte
    SET nom = ?, description = ?, typeObjet = ?, idBase = ?
    WHERE idObjetConnecte = ?
  `;

  db.query(sql, [nom, description || "", typeObjet, idBase, id], (err, result) => {
    if (err) {
      console.error("❌ Erreur SQL lors de la mise à jour des métadonnées :", err);
      return res.status(500).json({ error: "Erreur serveur lors de la mise à jour" });
    }
    res.status(200).json({ message: "Metadonnées mises à jour" });
  });
});


router.get("/rapport", (req, res) => {
  const sql = `
    SELECT 
      o.idObjetConnecte,
      o.nom,
      o.typeObjet,
      o.emplacement,
      u.nom AS nomUtilisateur,
      u.prenom AS prenomUtilisateur,
      d.dateCollecte,
      d.donnees
    FROM objet_connecte o
    LEFT JOIN donnees_objet d ON o.idObjetConnecte = d.idObjetConnecte
    LEFT JOIN utilisateur u ON o.ajoutePar = u.idUtilisateur
    ORDER BY o.idObjetConnecte, d.dateCollecte ASC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ Erreur SQL rapport :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    // Regrouper les données par objet
    const objets = {};

    rows.forEach(row => {
      const id = row.idObjetConnecte;
      if (!objets[id]) {
        objets[id] = {
          idObjet: id,
          nom: row.nom,
          type: row.typeObjet,
          emplacement: row.emplacement,
          utilisateur: `${row.prenomUtilisateur} ${row.nomUtilisateur}`,
          historique: []
        };
      }

      if (row.donnees && row.dateCollecte) {
        try {
          const valeurs = typeof row.donnees === "string"
            ? JSON.parse(row.donnees)
            : row.donnees;
      
          if (valeurs && typeof valeurs === "object") {
            objets[id].historique.push({
              timestamp: row.dateCollecte,
              ...valeurs
            });
          }
        } catch (e) {
          console.warn(`❌ JSON invalide pour l'objet ${id}`);
        }
      }
    });

    res.json(Object.values(objets));
  });
});

// ✅ Récupérer les objets en attente de validation
router.get("/a-valider", (req, res) => {
  const sql = `
    SELECT * FROM objet_connecte
    WHERE estValide = 0
    ORDER BY dateAjout DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ Erreur récupération objets à valider :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    res.json(rows);
  });
});



module.exports = router;
