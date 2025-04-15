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
  1, // 1 point à l'inscription
  idStatut,
  idEmplacement,
  idPlateforme,
  tokenValidation,
  expirationToken
];

console.log("🧪 Données envoyées à l'inscription :", valeurs);



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


router.put('/utilisateur/:id', upload.single('photo'), (req, res) => {
  const id = req.params.id;
  const {
    nom,
    prenom,
    age,
    genre,
    dateNaissance,
    motDePasse,
    point
  } = req.body;

  const photo = req.file ? req.file.filename : null;

  const champs = [];
  const valeurs = [];

  if (nom) {
    champs.push("nom = ?");
    valeurs.push(nom);
  }
  if (prenom) {
    champs.push("prenom = ?");
    valeurs.push(prenom);
  }
  if (age) {
    champs.push("age = ?");
    valeurs.push(age);
  }
  if (genre) {
    champs.push("genre = ?");
    valeurs.push(genre);
  }

  if (typeof motDePasse === 'string' && motDePasse.trim() !== '') {
    champs.push("motDePasse = ?");
    valeurs.push(motDePasse.trim());
  }

  const parsedPoint = parseInt(point);
  if (!isNaN(parsedPoint)) {
    champs.push("point = ?");
    valeurs.push(parsedPoint);
  }

  if (dateNaissance) {
    const dateObj = new Date(dateNaissance);
    if (!isNaN(dateObj.getTime())) {
      const formattedDate = dateObj.toISOString().slice(0, 10);
      champs.push("dateNaissance = ?");
      valeurs.push(formattedDate);
    } else {
      return res.status(400).json({ error: "Date de naissance invalide." });
    }
  }

  if (photo) {
    champs.push("photo = ?");
    valeurs.push(photo);
  }

  if (champs.length === 0) {
    return res.status(400).json({ error: "Aucune donnée à mettre à jour." });
  }

  const sql = `
    UPDATE utilisateur 
    SET ${champs.join(', ')} 
    WHERE idUtilisateur = ?
  `;
  valeurs.push(id);

  // ✅ Logs déplacés ici
  console.log("🧪 Données reçues :", req.body);
  console.log("🧾 SQL:", sql);
  console.log("📦 Valeurs:", valeurs);

  db.query(sql, valeurs, (err, result) => {
    if (err) {
      console.error("❌ Erreur SQL (update) :", err);
      return res.status(500).json({ error: "Erreur lors de la mise à jour" });
    }

    res.status(200).json({ message: "✅ Profil mis à jour avec succès" });
  });
});




// Route POST : demande de réinitialisation de mot de passe
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email requis' });
  }

  const tokenReset = crypto.randomBytes(32).toString('hex');
  const expirationReset = new Date(Date.now() + 60 * 60 * 1000); // expire dans 1h

  const updateSql = `
    UPDATE utilisateur SET tokenReset = ?, expirationReset = ?
    WHERE email = ?
  `;

  db.query(updateSql, [tokenReset, expirationReset, email], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erreur SQL' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Aucun utilisateur trouvé pour cet email" });
    }

    // Envoi de l'email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'acceslycontact@gmail.com',
        pass: 'teqw bolj xjup wqtj '
      }
    });

    const resetUrl = `http://localhost:5173/reset-password/${tokenReset}`;

    const mailOptions = {
      from: 'Accessly <acceslycontact@gmail.com>',
      to: email,
      subject: 'Réinitialisation du mot de passe - Accessly',
      html: `<p>Tu as demandé une réinitialisation de ton mot de passe.</p>
             <p>Clique ici pour créer un nouveau mot de passe :</p>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>Ce lien expirera dans 1 heure.</p>`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Erreur envoi email :", err);
        return res.status(500).json({ error: "Erreur lors de l'envoi de l'email" });
      }
      console.log("Email de réinitialisation envoyé :", info.response);
      res.status(200).json({ message: "Lien de réinitialisation envoyé" });
    });
  });
});

// Route PUT : réinitialisation du mot de passe
router.put('/reset-password/:token', (req, res) => {
  const token = req.params.token;
  const { motDePasse } = req.body;

  if (!motDePasse) {
    return res.status(400).json({ error: 'Mot de passe requis' });
  }

  const selectSql = `
    SELECT idUtilisateur FROM utilisateur
    WHERE tokenReset = ? AND expirationReset > NOW()
  `;

  db.query(selectSql, [token], (err, results) => {
    if (err) return res.status(500).json({ error: "Erreur SQL" });

    if (results.length === 0) {
      return res.status(400).json({ error: "Lien invalide ou expiré" });
    }

    const id = results[0].idUtilisateur;

    const updateSql = `
      UPDATE utilisateur 
      SET motDePasse = ?, tokenReset = NULL, expirationReset = NULL
      WHERE idUtilisateur = ?
    `;

    db.query(updateSql, [motDePasse, id], (err2) => {
      if (err2) return res.status(500).json({ error: "Erreur mise à jour mot de passe" });

      res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
    });
  });
});


module.exports = router;


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

    // ✅ Incrémentation des points de 1
    const updatePoints = `
      UPDATE utilisateur SET point = point + 1 WHERE idUtilisateur = ?
    `;

    db.query(updatePoints, [utilisateur.idUtilisateur], (updateErr) => {
      if (updateErr) {
        console.error("❌ Erreur lors de la mise à jour des points :", updateErr);
        return res.status(500).json({ error: "Erreur interne (points)" });
      }

      // ✅ Réponse finale avec succès
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
});


  //ROUT Post re-innitialisation mot de passe
  
  router.post('/motdepasse-oublie', (req, res) => {
    const { email } = req.body;
  
    const sql = `SELECT idUtilisateur, prenom FROM utilisateur WHERE email = ?`;
    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error("Erreur SQL : ", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: "Aucun compte trouvé avec cet email" });
      }
  
      const utilisateur = results[0];
      const tokenReset = crypto.randomBytes(32).toString('hex');
      const expirationReset = new Date(Date.now() + 3600000); // 1h
  
      const updateSql = `
        UPDATE utilisateur
        SET tokenReset = ?, expirationReset = ?
        WHERE idUtilisateur = ?
      `;
  
      db.query(updateSql, [tokenReset, expirationReset, utilisateur.idUtilisateur], (err2) => {
        if (err2) {
          console.error("Erreur mise à jour token reset :", err2);
          return res.status(500).json({ error: "Erreur serveur" });
        }
  
        // Envoi de l'email
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'acceslycontact@gmail.com',
            pass: 'teqw bolj xjup wqtj'
          }
        });
  
        const lien = `http://localhost:5173/reinitialiser-mot-de-passe/${tokenReset}`;
  
        const mailOptions = {
          from: '"Accessly" <acceslycontact@gmail.com>',
          to: email,
          subject: '🔐 Réinitialise ton mot de passe',
          html: `<p>Bonjour ${utilisateur.prenom},</p>
                 <p>Tu peux réinitialiser ton mot de passe en cliquant sur ce lien :</p>
                 <a href="${lien}">${lien}</a>
                 <p>Ce lien est valable 1 heure.</p>`
        };
  
        transporter.sendMail(mailOptions, (err3, info) => {
          if (err3) {
            console.error("Erreur envoi mail :", err3);
            return res.status(500).json({ error: "Erreur envoi de mail" });
          }
  
          res.status(200).json({ message: "Email de réinitialisation envoyé." });
        });
      });
    });
  });
  
  

// Obtenir les infos publiques de tous les utilisateurs (niveau visible par tous, détails visibles par admin)
router.get('/profils-publics', (req, res) => {
  const sql = `
    SELECT idUtilisateur, prenom, nom, email, age, genre, photo, typeMembre, estVerifie, point, idStatut
    FROM utilisateur
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Erreur SQL :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    res.json(result);
  });
});



// Route GET : infos d'un utilisateur par son ID
router.get('/utilisateur/:id', (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT idUtilisateur, email, age, genre, dateNaissance, typeMembre, photo, nom, prenom, point
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
  
    const selectSql = `
      SELECT idUtilisateur FROM utilisateur 
      WHERE tokenValidation = ? AND expirationToken > NOW()
    `;
  
    db.query(selectSql, [token], (err, results) => {
      if (err) {
        console.error("❌ Erreur SELECT :", err);
        return res.status(500).json({ error: "Erreur SQL" });
      }
  
      console.log("📥 Résultat SELECT :", results);
  
      if (results.length === 0) {
        return res.status(400).json({ error: "Lien invalide ou expiré" });
      }
  
      const id = results[0].idUtilisateur;
      console.log("✅ ID trouvé :", id);
  
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
  
        console.log("🛠️ Résultat UPDATE :", result2);
        res.status(200).json({ message: "✅ Compte activé avec succès !" });
      });
    });
  });

  router.delete('/utilisateur/:id', (req, res) => {
    const id = req.params.id;
  
    // Requête pour vérifier si l'utilisateur à supprimer est un admin
    const checkAdmin = `SELECT typeMembre FROM utilisateur WHERE idUtilisateur = ?`;
  
    db.query(checkAdmin, [id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Erreur SQL' });
      if (result.length === 0) return res.status(404).json({ error: 'Utilisateur introuvable' });
  
      if (result[0].typeMembre === 'admin') {
        return res.status(403).json({ error: 'Impossible de supprimer un admin' });
      }
  
      const sql = `DELETE FROM utilisateur WHERE idUtilisateur = ?`;
      db.query(sql, [id], (err2) => {
        if (err2) return res.status(500).json({ error: 'Erreur lors de la suppression' });
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
      });
    });
  });
  

  