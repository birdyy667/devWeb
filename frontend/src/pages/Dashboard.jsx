import { useState, useEffect } from 'react';

function Dashboard() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [message, setMessage] = useState('');
  const [estConnecte, setEstConnecte] = useState(true); // simulation

  useEffect(() => {
    // Simule un ID utilisateur (à remplacer par une variable réelle plus tard)
    const userId = localStorage.getItem('userId');


    fetch(`http://localhost:3001/api/utilisateur/${userId}`)
      .then((res) => res.json())
      .then((data) => setUtilisateur(data))
      .catch((err) => {
        console.error(err);
        setMessage("Erreur lors du chargement du profil.");
      });
  }, []);

  if (!utilisateur) {
    return <p>Chargement du profil...</p>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>👤 Profil utilisateur</h2>
      {message && <p>{message}</p>}

      <h3>🔓 Partie publique</h3>
      <img src={utilisateur.photo} alt="Photo" style={{ width: '100px', borderRadius: '50%' }} />
      <p><strong>Email / Pseudonyme :</strong> {utilisateur.email}</p>
      <p><strong>Âge :</strong> {utilisateur.age} ans</p>
      <p><strong>Genre :</strong> {utilisateur.genre}</p>
      <p><strong>Date de naissance :</strong> {utilisateur.dateNaissance}</p>
      <p><strong>Type de membre :</strong> {utilisateur.typeMembre}</p>

      {estConnecte && (
        <>
          <h3>🔐 Partie privée</h3>
          <p><strong>Nom :</strong> {utilisateur.nom}</p>
          <p><strong>Prénom :</strong> {utilisateur.prenom}</p>
        </>
      )}
    </div>
  );
}

export default Dashboard;
