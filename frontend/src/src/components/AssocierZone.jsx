import { useState } from 'react';
import axios from 'axios';

function AssocierZone({ objectId }) {
  const [zone, setZone] = useState('');

  const handleAssocier = async () => {
    try {
      await axios.patch(`http://localhost:3001/api/gestion-objets/configurer/${objectId}`, {
        outils: {
          zone: zone
        }
      });
      alert('Zone associée avec succès !');
    } catch (err) {
      console.error('Erreur lors de l’association de la zone', err);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Nom de la zone"
        value={zone}
        onChange={(e) => setZone(e.target.value)}
      />
      <button onClick={handleAssocier} style={{ marginLeft: '10px' }}>
        Associer Zone
      </button>
    </div>
  );
}

export default AssocierZone;
