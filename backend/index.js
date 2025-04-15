// 📁 index.js

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ✅ Middleware CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// ✅ Middleware JSON
app.use(express.json());

// ✅ Servir les fichiers uploadés (ex: /uploads/photo.jpg)
app.use('/uploads', express.static('uploads'));

// ✅ Importer les routes
const utilisateursRoutes = require('./routes/utilisateurs');
const objetsConnectesRoutes = require('./routes/objetConnecte.routes');
const editableFieldsRoutes = require('./routes/editableFields');
const gestionObjetsRoutes = require('./routes/gestionObjets');

// ✅ Utiliser les routes
app.use('/api', utilisateursRoutes);
app.use('/api/objets-connectes', objetsConnectesRoutes);
app.use('/api/champs-editables', editableFieldsRoutes);
app.use('/api/gestion-objets', gestionObjetsRoutes);

// ✅ Lancer le serveur
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend lancé sur http://localhost:${PORT}`);
});
