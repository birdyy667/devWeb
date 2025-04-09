const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');



// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  }
});
const upload = multer({ storage });

// GET tous les utilisateurs
router.get('/utilisateurs', (req, res) => {
  db.query('SELECT * FROM utilisateur', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});


// Route POST : création de compte (register)
router.post('/register', upload.single('photo'), (req, res) => {
  const {
    email,
    motDePasse,
    nom,
    prenom,
    typeMembre,
    age,
    genre,
    dateNaissance,
    point,
    idStatut,
    idEmplacement,
    idPlateforme
  } = req.body;

  const photo = req.file ? req.file.filename : null;

  // 👉 Vérifier si l’email est déjà utilisé
  const checkEmail = 'SELECT email FROM utilisateur WHERE email = ?';
  db.query(checkEmail, [email], (err, results) => {
    if (err) {
      console.error("❌ Erreur SQL (vérif email) :", err);
      return res.status(500).json({ error: 'Erreur SQL : ' + err.message });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    }

    // 👉 Si l’email est disponible, on continue normalement
    const tokenValidation = crypto.randomBytes(32).toString('hex');
    const expirationToken = new Date(Date.now() + 60 * 60 * 1000); // expire dans 1h

    const sql = `
    INSERT INTO utilisateur (
    email, motDePasse, nom, prenom, typeMembre, photo,
    age, genre, dateNaissance, point,
    idStatut, idEmplacement, idPlateforme,
    tokenValidation, expirationToken
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
  idPlateforme,
  tokenValidation,
  expirationToken
];


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'acceslycontact@gmail.com',
    pass: 'teqw bolj xjup wqtj '
  }
});

const urlValidation = `http://localhost:5173/confirmation/${tokenValidation}`;

const mailOptions = {
  from: '"Accessly" <acceslycontact@gmail.com>',
  to: email,
  subject: 'Confirme ton inscription à Accessly',
  html: `<p>Bienvenue ${prenom},</p>
         <p>Clique sur le lien suivant pour valider ton compte :</p>
         <a href="${urlValidation}">${urlValidation}</a>
         <p>Ce lien expire dans 1 heure.</p>`
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error("❌ Erreur d'envoi de l'email :", err);
  } else {
    console.log("✉️ Email de confirmation envoyé :", info.response);
  }
});


    db.query(sql, valeurs, (err, result) => {
      if (err) {
        console.error("❌ Erreur SQL (insert) :", err);
        return res.status(500).json({ error: 'Erreur SQL : ' + err.message });
      }

      return res.status(201).json({
        message: '✅ Compte créé avec succès',
        userId: result.insertId
      });
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

      if (utilisateur.estVerifie !== 1) {
        return res.status(403).json({
          error: "Veuillez confirmer votre adresse email avant de vous connecter."
        });
      }
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

  // Route GET : confirmation d'inscription par token
  router.get('/confirmation/:token', (req, res) => {
    const token = req.params.token;
    console.log("📩 Token reçu :", token);
  
    // Étape 1 : vérifier s'il y a un utilisateur avec ce token actif
    const selectSql = `
      SELECT idUtilisateur FROM utilisateur 
      WHERE tokenValidation = ? AND expirationToken > NOW()
    `;
  
    db.query(selectSql, [token], (err, results) => {
      if (err) {
        console.error("❌ Erreur SELECT :", err);
        return res.status(500).json({ error: "Erreur SQL" });
      }
  
      // ✅ Si le token est encore valide
      if (results.length > 0) {
        const id = results[0].idUtilisateur;
  
        const updateSql = `
          UPDATE utilisateur 
          SET estVerifie = 1, tokenValidation = NULL, expirationToken = NULL 
          WHERE idUtilisateur = ?
        `;
  
        db.query(updateSql, [id], (err2, result2) => {
          if (err2) {
            console.error("❌ Erreur UPDATE :", err2);
            return res.status(500).json({ error: "Erreur de mise à jour" });
          }
  
          console.log("✅ Compte activé pour l'utilisateur :", id);
          return res.status(200).json({ message: "✅ Compte activé avec succès !" });
        });
  
      } else {
        // Étape 2 : si pas de token actif, vérifier si déjà vérifié
        const checkIfAlreadyVerified = `
          SELECT estVerifie FROM utilisateur 
          WHERE tokenValidation IS NULL AND expirationToken IS NULL AND estVerifie = 1
        `;
  
        db.query(checkIfAlreadyVerified, (err3, verifiedResults) => {
          if (err3) {
            console.error("❌ Erreur SELECT (déjà vérifié) :", err3);
            return res.status(500).json({ error: "Erreur SQL" });
          }
  
          if (verifiedResults.length > 0) {
            return res.status(200).json({ message: "⚠️ Ce compte est déjà activé." });
          }
  
          // Sinon : lien réellement invalide ou expiré
          return res.status(400).json({ error: "Lien invalide ou expiré" });
        });
      }
    });
  });
  