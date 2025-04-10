const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const utilisateursRoutes = require('./routes/utilisateurs');
app.use('/api', utilisateursRoutes);

const gestionObjetsRoutes = require('./routes/gestionObjets');
app.use('/api/gestionObjets', gestionObjetsRoutes);

// Démarrer le serveur
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend lancé sur http://localhost:${PORT}`);
});

