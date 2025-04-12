const express = require('express');
const http = require('http');
//const { Server } = require('socket.io');
const router = express.Router();
const db = require('../config/db');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);

/*
// Set up socket.io
const io = new Server(
	server, {
		cors: { origin: '*' }
	}
);

// Make io accessible inside routes
app.set('socketio', io);

// Socket connection
io.on(
	'connection', (socket) => {
		console.log('🟢 A user connected');

		socket.on(
			'disconnect', () => {
				console.log('🔴 User disconnected');
			}
		);
	}
);

server.listen(
	3001, () => {
		console.log('🚀 Server running at http://localhost:3001');
	}
);
*/

// GET tous les objets
router.get(
	'/recherche', (req, res) => {
		db.query(
			'SELECT * FROM objet_connecte', (err, result) => {
				if (err) {
					return res.status(500).json({
						error: err.message
					});
				}
				res.json(result);
			}
		);
	}
);


// Route POST : identification égalité
router.post(
	'/recherche', (req, res) => {
		const io = req.app.get('socketio');		// 👈 Get socket instance
		const {
			nom,
			outils,
		} = req.body;
		
		// 👉 Vérifier si le couple nom et outils existe déjà
		const checkEqual = 'SELECT * FROM objet_connecte WHERE (nom LIKE ? OR outils LIKE ?)';
		
		db.query(
			checkEqual, ['"%' + nom + '%"', '"%' + nom + '%"'], (err, results) => {
				if (err) {
					console.error("❌ Erreur SQL (vérif égalité) :", err);
					return res.status(500).json({
						error: 'Erreur SQL : ' + err.message
					});
				}
				
				if (results.length > 0){
					res.json(results[0]);
					io.emit('recherche-result', results[0]); // 👈 Real-time update here
				}
				else {
					res.status(404).json({
						message: 'Aucun résultat'
					});
				}
			}
		);
	}
);


/*
// Route GET: recherche de la valeur dans bdd
router.get('/check', (req, res) => {
	const query = req.query.query;

	if (!query) {
		return res.status(400).json({ error: 'Missing search query' });
	}

	const sql = `
		SELECT id, nom, outils
		FROM objet_connecte 
		WHERE (nom LIKE ? OR outils LIKE ?)
		LIMIT 10
	`;

	db.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
		if (err) {
			console.error("❌ Erreur SQL (check) :", err);
			return res.status(500).json({ error: 'Erreur SQL : ' + err.message });
		}
		
		const exists = (results.length > 0);

		res.json({ exists });		// 👈 this is what your frontend expects
	});
});
*/

// Route GET : infos d'un objet par son identifiant
router.get(
	'/objet/:id', (req, res) => {
		const objId = req.params.id;
		
		const sql = `
			SELECT idObjetConnecte, nom, outils, photo, idPlateforme
			FROM objet_connecte
			WHERE idObjetConnecte = ?
		`;
		
		db.query(
			sql, [objId], (err, results) => {
				if (err) {
					return res.status(500).json({
						error: err.message
					});
				}
				if (results.length === 0) {
					return res.status(404).json({
						error: 'Objet connecté non trouvé'
					});
				}
				
				res.json(results[0]);
			}
		);
	}
);

module.exports = router;
