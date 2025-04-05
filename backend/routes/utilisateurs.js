const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET tous les utilisateurs
router.get('/utilisateurs', (req, res) => {
  db.query('SELECT * FROM utilisateur', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Route POST : création de compte (register)
router.post('/register', (req, res) => {
    const {
      email,
      motDePasse,
      nom,
      prenom,
      typeMembre,
      photo,
      age,
      genre,
      dateNaissance,
      point,
      idStatut,
      idEmplacement,
      idPlateforme
    } = req.body;
  
    const sql = `
      INSERT INTO utilisateur (
        email, motDePasse, nom, prenom, typeMembre, photo,
        age, genre, dateNaissance, point,
        idStatut, idEmplacement, idPlateforme
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    const valeurs = [
      email,
      motDePasse,
      nom,
      prenom,
      typeMembre,
      photo,
      age,
      genre,
      dateNaissance,
      point,
      idStatut,
      idEmplacement,
      idPlateforme
    ];
  
    db.query(sql, valeurs, (err, result) => {
      if (err) {
        console.error("❌ Erreur SQL :", err);
        return res.status(500).json({ error: 'Erreur SQL : ' + err.message });
      }
  
      return res.status(201).json({
        message: '✅ Compte créé avec succès',
        userId: result.insertId
      });
    });
  });

module.exports = router;


// Route POST : connexion utilisateur
router.post('/login', (req, res) => {
    const { email, motDePasse } = req.body;
  
    if (!email || !motDePasse) {
      return res.status(400).json({ error: 'Email et mot de passe obligatoires' });
    }
  
    const sql = `
      SELECT * FROM utilisateur WHERE email = ? AND motDePasse = ?
    `;
  
    db.query(sql, [email, motDePasse], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
  
      if (results.length === 0) {
        return res.status(401).json({ error: 'Identifiants incorrects' });
      }
  
      const utilisateur = results[0];
      res.status(200).json({
        message: 'Connexion réussie ✅',
        utilisateur: {
          id: utilisateur.idUtilisateur,
          email: utilisateur.email,
          age: utilisateur.age,
          genre: utilisateur.genre
        }
      });
    });
  });
  

// Route GET : infos d'un utilisateur par son ID
router.get('/utilisateur/:id', (req, res) => {
    const userId = req.params.id;
  
    const sql = `
      SELECT idUtilisateur, email, age, genre, dateNaissance, typeMembre, photo, nom, prenom
      FROM utilisateur
      WHERE idUtilisateur = ?
    `;
  
    db.query(sql, [userId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
  
      res.json(results[0]);
    });
  });
  