const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql2');

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Servir les fichiers statiques (images de profil)
app.use('/uploads', express.static('uploads'));

// Routes
const utilisateursRoutes = require('./routes/utilisateurs');
app.use('/api', utilisateursRoutes);

const gestionObjetsRoutes = require('./routes/gestionObjets');
app.use('/api/gestion-objets', gestionObjetsRoutes);

// Démarrer le serveur
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend lancé sur http://localhost:${PORT}`);
});
