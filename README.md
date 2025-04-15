# 🏬 Accessly – Plateforme de gestion de centre commercial

Bienvenue sur **Accessly**, une plateforme intelligente de gestion d'un centre commercial, développée dans le cadre du projet de développement web à CY Tech.

---

## 🚀 Lancer le projet en local

### 1. Cloner le dépôt
```bash
git clone https://github.com/birdyy667/devWeb.git
cd devWeb
```

### 2. Initialiser la base de données
- Ouvrir **MySQL Workbench** ou votre terminal MySQL
- Importer le fichier : `backend/centreCommerciale_dump.sql`
- Cela créera la base `centreCommerciale` avec toutes les tables nécessaires

### 3. Configurer la connexion MySQL

> Modifiez le fichier `backend/config/db.js` en fonction de vos identifiants locaux :

```js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'votre_user_mysql',       // 👉 à modifier
  password: 'votre_mot_de_passe', // 👉 à modifier
  database: 'centreCommerciale'
});

module.exports = db;
```

> Exemple si vous utilisez MySQL avec root et pas de mot de passe :
```js
user: 'root',
password: '',
```

### 4. Installer les dépendances
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 5. Lancer le serveur backend
```bash
cd backend
node index.js
```

### 6. Lancer le frontend
```bash
cd frontend
npm run dev
```

### 7. Lancer le site

> Ecrire dans la barre de recherche d'un navigateur
```bash
localhost:5173
```
---

## ✨ Fonctionnalités développées

### ✅ Authentification
- Création de compte avec vérification par email
- Connexion / Déconnexion
- Réinitialisation de mot de passe avec token sécurisé

### ✅ Dashboard personnalisé
- Données affichées selon le type d’utilisateur (admin ou standard)

### ✅ Gestion des utilisateurs
- Chaque utilisateur a un niveau selon ses points (connexion, interaction)
- Système d’administration (les admins peuvent modifier ou supprimer des profils)

### ✅ Gestion des objets connectés
- Ajout d’objets avec image, type, description, emplacement
- Visualisation en grille avec recherche
- Modification inline des paramètres (température, luminosité, etc.)
- Validation des propositions par les administrateurs
- Formulaire d’ajout dans une sidebar moderne

### ✅ Données dynamiques
- Chaque type d’objet possède ses propres paramètres (thermostat, caméra, lumière, etc.)
- Données enregistrées dans un historique
- Graphiques d’évolution visibles dans l’onglet **Rapport**

### ✅ Système de rôles et permissions
- Niveau 1 : lecture seule
- Niveau 2 : recherche et suggestion
- Niveau 3 : suggestion d’objet
- Niveau 4 (admin) : création, modification, validation, suppression

### ✅ Interface
- Sidebar fixe et moderne
- Page d’accueil animée avec vidéo (LandingPage)
- Modales pour l’inscription et la connexion

---

## 🔐 Sécurité
- Jetons de confirmation et de réinitialisation de mot de passe
- Middleware de route privée pour bloquer l’accès sans login

---

## 📁 Arborescence simplifiée

```
├── backend
│   ├── config/db.js
│   ├── routes/*.js
│   └── centreCommerciale_dump.sql
├── frontend
│   ├── src/components
│   ├── src/pages
│   ├── src/layouts
│   └── src/App.jsx
```

---

## 👨‍💻 Développé avec :
- Node.js + Express
- React + Vite
- MySQL
- Tailwind CSS

---

## ✍️ Auteurs
Projet réalisé dans le cadre du module Développement Web à CY Tech (ING1).

