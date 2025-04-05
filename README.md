# devWeb



# 🏢 Plateforme intelligente – Centre Commercial Connecté

Projet web fullstack permettant la gestion de comptes utilisateurs, d’objets connectés et de plateformes dans un environnement type centre commercial.

---

## 📁 Architecture du projet

```
Projet/
├── backend/
│   ├── config/              # Configuration de la base de données
│   ├── routes/              # Routes Express : utilisateurs (register, login, etc.)
│   ├── database/            # Fichier .sql et README pour la base de données
│   ├── index.js             # Serveur Express principal
│   ├── package.json         # Dépendances backend
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Pages React : Register, Login, Dashboard
│   │   ├── components/      # Navbar, PrivateRoute (routes protégées)
│   ├── public/
│   ├── index.html
│   ├── App.jsx              # Définition des routes React
│   ├── vite.config.js       # Config Vite
│   ├── package.json         # Dépendances frontend
```

---

## ⚙️ Frameworks & outils utilisés

| Partie       | Technologies utilisées                      |
|--------------|----------------------------------------------|
| Base de données | MySQL (dump SQL fourni)                   |
| Backend      | Node.js, Express, mysql2, cors               |
| Frontend     | React, React Router, Vite                    |
| Auth simple  | localStorage (userId)                        |
| Tests API    | Postman                                      |
| Dev Tools    | VSCode, Git, GitHub                          |

---

## 🚀 Lancer le projet localement

### 📦 Backend (API Express)
```bash
cd backend
npm install
node index.js
```
→ Le backend démarre sur : `http://localhost:3001`

---

### 🌐 Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
→ Le frontend démarre sur : `http://localhost:5173`

---

## 🗃️ Importer la base de données

Le fichier `centreCommerciale.sql` se trouve dans `backend/database/`.

### Étapes :
1. Ouvrir un terminal
2. Lancer MySQL :
   ```bash
   mysql -u root -p
   ```
3. Créer la base :
   ```sql
   CREATE DATABASE IF NOT EXISTS centreCommerciale;
   EXIT;
   ```
4. Importer le fichier SQL :
   ```bash
   mysql -u root -p centreCommerciale < backend/database/centreCommerciale.sql
   ```

---

## 🔑 Fonctionnalités déjà prêtes

- ✅ Inscription (`/inscription`)
- ✅ Connexion (`/connexion`)
- ✅ Dashboard utilisateur (`/dashboard`)
- ✅ Déconnexion
- ✅ Protection des routes (PrivateRoute)
- ✅ Affichage dynamique des infos de l’utilisateur connecté
- ✅ Système de rôles (`client`, `commerçant`, `admin`)

---

## 📌 Ce qu’il faut savoir pour coder efficacement

### 🔧 Backend

- Fichier principal : `index.js`
- Routes API disponibles dans `routes/utilisateurs.js`
- Utilisation de `mysql2` pour interroger la base
- Pour créer une nouvelle route : ajouter dans `routes/`, puis importer dans `index.js`

### 🎨 Frontend

- React avec Vite (rapide pour le dev)
- Les pages sont dans `src/pages`
- La navigation est gérée avec `react-router-dom`
- L’authentification est très simple : on stocke l’`userId` dans `localStorage`
- Le composant `PrivateRoute` empêche l’accès au dashboard si l’utilisateur n’est pas connecté

### 📦 Pour ajouter une page :
1. Créer un fichier dans `pages/` (ex: `Profil.jsx`)
2. L’ajouter dans `App.jsx` avec un `<Route />`


---

## 🤝 Collaboration

- Chacun peut cloner le repo, lancer le projet localement et travailler dans une branche
- Pour push, utilisez votre propre token GitHub
- Demandez à être ajouté en **collaborateur** si vous ne pouvez pas pousser

---
