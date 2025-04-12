import React, { useState } from 'react';
import axios from 'axios';

function ConfigurerObjet({ objectId }) {
  const [jsonText, setJsonText] = useState('');
  const [message, setMessage] = useState('');

  const handleConfig = async (e) => {
    e.preventDefault();
    try {
      const configuration = JSON.parse(jsonText);
      await axios.patch(`http://localhost:3001/api/gestion-objets/configurer/${objectId}`, {
        configuration,
      });
      setMessage('Configuration mise à jour avec succès.');
      setJsonText('');
    } catch (error) {
      console.error('Erreur config objet :', error);
      setMessage("Erreur : JSON invalide ou requête échouée.");
    }
  };

  return (
    <div>
      <h4>Configurer l'objet (JSON)</h4>
      <form onSubmit={handleConfig}>
        <textarea
          placeholder='{"temperature": 22, "mode": "auto"}'
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          rows={5}
          cols={40}
          required
        />
        <br />
        <button type="submit">Appliquer</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ConfigurerObjet;
