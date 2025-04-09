const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'devweb',       // remplace si besoin
  password: '',     // ton mot de passe
  database: 'centreCommerciale'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Erreur de connexion MySQL :', err);
  } else {
    console.log('✅ Connecté à MySQL');
  }
});

module.exports = db;
