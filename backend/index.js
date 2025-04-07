const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());

// Servir les images uploadées (ex: /uploads/photo.jpg)
app.use('/uploads', express.static('uploads'));

// Routes
const utilisateursRoutes = require('./routes/utilisateurs');
app.use('/api', utilisateursRoutes);

// Démarrer le serveur
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend lancé sur http://localhost:${PORT}`);
});
