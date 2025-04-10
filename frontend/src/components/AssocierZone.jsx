import React, { useState } from 'react';
import axios from 'axios';

function AssocierZone({ objectId }) {
  const [zone, setZone] = useState('');
  const [message, setMessage] = useState('');

  const handleAssocier = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:3001/api/gestionObjets/associerZone/${objectId}`, {
        zone
      });
      setMessage(`Zone "${zone}" associée avec succès.`);
      setZone('');
    } catch (error) {
      console.error('Erreur association zone :', error);
      setMessage('Erreur lors de l\'association de la zone.');
    }
  };

  return (
    <div>
      <h4>Associer à une zone</h4>
      <form onSubmit={handleAssocier}>
        <input
          type="text"
          placeholder="Ex: Salon, Bureau..."
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          required
        />
        <button type="submit">Associer</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AssocierZone;
