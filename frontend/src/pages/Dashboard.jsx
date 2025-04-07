import { useState, useEffect } from 'react';

function Dashboard() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [message, setMessage] = useState('');
  const [estConnecte, setEstConnecte] = useState(true); // simulation

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      setMessage("Utilisateur non connecté.");
      return;
    }

    fetch(`http://localhost:3001/api/utilisateur/${userId}`)
      .then((res) => res.json())
      .then((data) => setUtilisateur(data))
      .catch((err) => {
        console.error(err);
        setMessage("Erreur lors du chargement du profil.");
      });
  }, []);

  if (!utilisateur) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white text-xl">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-blue-700 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">👤 Profil utilisateur</h2>

        {message && (
          <div className="text-red-600 text-center">
            {message}
          </div>
        )}

        <div className="flex flex-col items-center space-y-2">
          <img
            src={
              utilisateur.photo
                ? `http://localhost:3001/uploads/${utilisateur.photo}`
                : '/default-avatar.png'
            }
            alt="Photo de profil"
            className="w-24 h-24 rounded-full object-cover shadow"
          />
          <p className="text-gray-600">Type de membre : <span className="font-semibold">{utilisateur.typeMembre}</span></p>
        </div>

        <div className="border-t pt-4 space-y-2">
          <h3 className="text-lg font-semibold text-blue-600">🔓 Partie publique</h3>
          <p><strong>Email / Pseudonyme :</strong> {utilisateur.email}</p>
          <p><strong>Âge :</strong> {utilisateur.age} ans</p>
          <p><strong>Genre :</strong> {utilisateur.genre}</p>
          <p><strong>Date de naissance :</strong> {new Date(utilisateur.dateNaissance).toLocaleDateString()}</p>
        </div>

        {estConnecte && (
          <div className="border-t pt-4 space-y-2">
            <h3 className="text-lg font-semibold text-blue-600">🔐 Partie privée</h3>
            <p><strong>Nom :</strong> {utilisateur.nom}</p>
            <p><strong>Prénom :</strong> {utilisateur.prenom}</p>
          </div>
        )}

        <button
          onClick={() => {
            localStorage.removeItem('userId');
            window.location.href = '/connexion';
          }}
          className="w-full mt-4 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
