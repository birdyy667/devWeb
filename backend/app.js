const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { createServer } = require('node:http');

const app = express();
const server = createServer(app);

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Routes
app.use('/api/users', require('./routes/utilisateurs'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/objects', require('./routes/objectRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
