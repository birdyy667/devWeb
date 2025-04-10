import React, { useState } from 'react';
import axios from 'axios';

function AjoutObjets({ setObjects }) {
  const [nom, setNom] = useState('');
  const [statut, setStatut] = useState('actif');  // Ajout d'un statut
  const [outils, setOutils] = useState('');
  const [idPlateforme, setIdPlateforme] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/gestionObjets/ajouter', {
        nom, statut, outils, idPlateforme
      });
      setObjects((prevObjects) => [...prevObjects, response.data]);
      // Réinitialiser le formulaire après l'ajout
      setNom('');
      setStatut('actif');  // Réinitialiser le statut
      setOutils('');
      setIdPlateforme('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'objet', error);
      setError('Impossible d\'ajouter l\'objet, veuillez réessayer.');
    }
  };

  return (
    <div>
      <h2>Ajouter un Objet Connecté</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Outils"
            value={outils}
            onChange={(e) => setOutils(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="ID Plateforme"
            value={idPlateforme}
            onChange={(e) => setIdPlateforme(e.target.value)}
            required
          />
        </div>
        <div>
          {/* Ajout du champ statut */}
          <label>Statut :</label>
          <select value={statut} onChange={(e) => setStatut(e.target.value)}>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
        </div>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}

export default AjoutObjets;


