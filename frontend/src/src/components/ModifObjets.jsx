import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModifObjets = ({ selectedObjectId, onSuccess }) => {
  const [objectData, setObjectData] = useState({
    nom: '',
    statut: '',
    description: '',  // Ajout de la description
    outils: '',       // Outils sous forme de texte JSON
  });

  // Charger les données de l'objet sélectionné
  useEffect(() => {
    if (selectedObjectId) {
      axios.get(`/api/gestion-objets/${selectedObjectId}`)
        .then((res) => {
          const obj = res.data;
          if (obj) {
            setObjectData({
              nom: obj.nom,
              statut: obj.statut,
              description: obj.description || '',  // Assurer la présence de la description
              outils: obj.outils ? JSON.stringify(obj.outils) : '', // Convertir les outils en chaîne JSON
            });
          }
        })
        .catch((err) => console.error("Erreur lors du chargement des données de l'objet", err));
    }
  }, [selectedObjectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const modifiedData = {
      ...objectData,
      outils: JSON.parse(objectData.outils), // Convertir en objet JSON avant d'envoyer
    };

    axios.put(`/api/gestion-objets/modifier/${selectedObjectId}`, modifiedData)
      .then(() => {
        alert("Objet modifié !");
        onSuccess();
      })
      .catch((err) => console.error(err));
  };

  if (!selectedObjectId) return <p>Sélectionnez un objet à modifier.</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h3>Modifier un objet</h3>
      <input
        type="text"
        name="nom"
        value={objectData.nom}
        onChange={handleChange}
        placeholder="Nom"
        required
      />
      <input
        type="text"
        name="description"
        value={objectData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <select name="statut" value={objectData.statut} onChange={handleChange}>
        <option value="actif">Actif</option>
        <option value="inactif">Inactif</option>
      </select>
      <textarea
        name="outils"
        value={objectData.outils}
        onChange={handleChange}
        placeholder="Outils (format JSON)"
        rows={5}
        required
      />
      <button type="submit">Mettre à jour</button>
    </form>
  );
};

export default ModifObjets;
