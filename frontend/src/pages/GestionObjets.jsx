import React, { useState, useEffect } from 'react';
import AjoutObjets from '../components/AjoutObjets';
import ListeObjets from '../components/ListeObjets';
import ModifObjets from '../components/ModifObjets';
import AssocierZone from '../components/AssocierZone'; // Associer une zone
import ConfigurerObjet from '../components/ConfigurerObjet'; // Configurer un objet
import axios from 'axios';

function GestionObjets() {
  const [objects, setObjects] = useState([]);
  const [selectedObjectId, setSelectedObjectId] = useState(null);

  // Charger les objets connectés depuis l'API au démarrage
  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/gestion-objets');
        setObjects(response.data); // Met à jour la liste des objets
      } catch (error) {
        console.error("Erreur lors de la récupération des objets", error);
      }
    };

    fetchObjects();
  }, []); // Ne s'exécute qu'une seule fois au démarrage

  const handleObjectEdit = (id) => {
    setSelectedObjectId(id); // Met à jour l'ID de l'objet sélectionné
  };

  return (
    <div className="App">
      <h1>Gestion des Objets Connectés</h1>

      {/* Composant d'ajout d'objet */}
      <AjoutObjets setObjects={setObjects} />

      {/* Liste des objets avec suppression et modification */}
      <ListeObjets
        objects={objects}
        setObjects={setObjects}
        onEdit={handleObjectEdit} // Fonction pour sélectionner un objet à modifier
      />

      {/* Si un objet est sélectionné, on affiche les options pour le modifier */}
      {selectedObjectId && (
        <div>
          <h3>Modifier l'objet connecté</h3>
          <ModifObjets objectId={selectedObjectId} setObjects={setObjects} />

          {/* Ajouter les fonctionnalités d'associer une zone et configurer l'objet */}
          <div style={{ marginTop: '20px' }}>
            <h4>Associer une zone :</h4>
            <AssocierZone objectId={selectedObjectId} />

            <h4>Configurer l'objet :</h4>
            <ConfigurerObjet objectId={selectedObjectId} />
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionObjets;

