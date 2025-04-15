// POST /api/objets-connectes/:id/donnees
router.post('/objets-connectes/:id/donnees', (req, res) => {
    const idObjet = req.params.id;
    const { donnees } = req.body;
  
    if (!donnees) {
      return res.status(400).json({ error: "Données requises." });
    }
  
    const sql = `
      INSERT INTO donnees_objet (idObjetConnecte, donnees)
      VALUES (?, ?)
    `;
  
    db.query(sql, [idObjet, JSON.stringify(donnees)], (err, result) => {
      if (err) {
        console.error("❌ Erreur SQL :", err);
        return res.status(500).json({ error: "Erreur serveur." });
      }
      res.status(201).json({ message: "Données enregistrées avec succès." });
    });
  });
  