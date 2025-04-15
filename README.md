# Projet Accessly - Centre Commercial Connecté

Bienvenue dans le projet **Accessly**, une plateforme web de gestion d’objets connectés pour un centre commercial. Ce projet a été réalisé dans le cadre de notre formation en développement web.


## 🔧 Configuration de la base de données (fichier db.js)

Avant de lancer le backend, vous devez configurer la connexion MySQL dans le fichier backend/config/db.js.
Ce fichier permet à l'application Node.js de se connecter à votre base de données centreCommerciale.

// backend/config/db.js

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',           // Ne rien changer si vous êtes en local
  user: 'devweb',              // 👉 Remplacez par votre identifiant MySQL
  password: '1234',            // 👉 Remplacez par votre mot de passe MySQL
  database: 'centreCommerciale' // Assurez-vous que la base existe
});

db.connect((err) => {
  if (err) {
    console.error('❌ Erreur de connexion MySQL :', err);
  } else {
    console.log('✅ Connecté à MySQL');
  }
});

module.exports = db;

✅ Exemple

Si votre nom d'utilisateur est root et que vous n'avez pas mis de mot de passe :

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'centreCommerciale'
});


## 🚀 Lancer le site en local

### 1. Prérequis
- Node.js (v18 recommandé)
- MySQL (serveur local configuré)

### 2. Initialisation de la base de données
1. Créer une base `centreCommerciale` dans MySQL
2. Importer le fichier `CentreCommerciale.sql` situé dans le dossier `backend`
3. Lancer MySQL et taper la commande :
   ```bash
   source /chemin/vers/backend/CentreCommerciale.sql
   ```

### 3. Lancer le backend (Express)
```bash
cd backend
npm install
node index.js
```
> Le serveur Express tourne sur http://localhost:3001

### 4. Lancer le frontend (React)
```bash
cd frontend
npm install
npm run dev
```
> Le frontend tourne sur http://localhost:5173

## 💡 Fonctionnalités disponibles

### 🔑 Authentification
- Inscription avec confirmation par email
- Connexion
- Réinitialisation de mot de passe
- Accès restreint via `PrivateRoute`

### 🌐 Landing Page
- Page d'accueil esthétique avec vidéo de fond et boutons d'accès

### 🔹 Dashboard
- Vue d'ensemble des informations utilisateur et de l’activité

### 👥 Profils Publics
- Liste de tous les utilisateurs (informations publiques)
- Barre de recherche et filtrage
- Pour les administrateurs :
  - Modification inline des profils
  - Suppression des utilisateurs
  - Création de nouveaux utilisateurs

### 💡 Objets Connectés
- Affichage des objets connectés
- Recherche par nom ou type
- Suggestion d'ajout d’objets (niveau 3)
- Ajout direct d'objets (admin / niveau 4)
- Modification des paramètres techniques dynamiques selon le type
- Suppression d’objets par les admins

### 📄 Page de validation
- Affichage des objets à valider
- Acceptation ou refus des suggestions d’ajout
- Notification visible pour les admins dans la sidebar

### 📊 Rapport
- Graphiques adaptés aux données de chaque objet (temps réel)
- Historique des valeurs collectées
- Nom et prénom de l'utilisateur ayant effectué la dernière mise à jour
- Message intelligent de situation (par ex : “Tout est normal” ou “Attention à la tension”)

## ⚙️ Structure technique
- Frontend : React + Tailwind CSS + React Router
- Backend : Express + MySQL
- Authentification par token email + stockage local
- Upload de photo via `multer`

## ✅ Statuts d'utilisateur
- **Visiteur** : accès à la landing page uniquement
- **Niveau 1-2** : accès limité à la consultation des objets
- **Niveau 3** : peut suggérer des objets
- **Niveau 4 (Admin)** : créer, modifier, valider, supprimer tout contenu

---

> Ce projet a été réalisé en équipe dans un cadre pédagogique. Merci de ne pas écraser les fichiers sans avoir vérifié l'historique Git !

---

Contact : [Votre nom ou email facultatif ici]

