import React from 'react';
import axios from 'axios';
import AssocierZone from './AssocierZone';
import ConfigurerObjet from './ConfigurerObjet';

function ListeObjets({ objects, setObjects }) {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/gestionObjets/supprimer/${id}`);
      setObjects(objects.filter(obj => obj.idObjetConnecte !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'objet", error);
    }
  };

  const toggleEtat = async (id, currentStatut) => {
    const nouveauStatut = currentStatut === 'actif' ? 'inactif' : 'actif';
    try {
      await axios.patch(`http://localhost:3001/api/gestionObjets/etat/${id}`, { statut: nouveauStatut });
      setObjects(prev =>
        prev.map(obj =>
          obj.idObjetConnecte === id ? { ...obj, statut: nouveauStatut } : obj
        )
      );
    } catch (error) {
      console.error('Erreur lors du changement de statut', error);
    }
  };

  return (
    <div>
      <h2>Liste des Objets Connectés</h2>
      <ul>
        {objects.map((obj) => (
          <li
            key={obj.idObjetConnecte}
            style={{
              marginBottom: '20px',
              opacity: obj.statut === 'inactif' ? 0.5 : 1,
              transition: 'opacity 0.3s'
            }}
          >
            <strong>{obj.nom}</strong> - Statut : {obj.statut}
            <br />
            <button onClick={() => handleDelete(obj.idObjetConnecte)}>Supprimer</button>
            <button
              style={{
                marginLeft: '10px',
                backgroundColor: obj.statut === 'actif' ? 'green' : 'red',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onClick={() => toggleEtat(obj.idObjetConnecte, obj.statut)}
            >
              {obj.statut === 'actif' ? 'Désactiver' : 'Activer'}
            </button>

            {/* Associer une zone */}
            <div style={{ marginTop: '10px' }}>
              <h4>Associer une zone :</h4>
              <AssocierZone objectId={obj.idObjetConnecte} />
            </div>

            {/* Configurer l'objet */}
            <div style={{ marginTop: '10px' }}>
              <h4>Configurer l'objet :</h4>
              <ConfigurerObjet objectId={obj.idObjetConnecte} />
            </div>

            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListeObjets;

