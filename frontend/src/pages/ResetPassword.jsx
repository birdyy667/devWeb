import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!motDePasse.trim()) {
      return setMessage('❌ Le mot de passe est requis.');
    }

    try {
      const res = await fetch(`http://localhost:3001/api/reset-password/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motDePasse }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Mot de passe réinitialisé avec succès.');
        navigate('/reset-success'); 
      } else {
        setMessage(`❌ ${data.error || 'Erreur lors de la réinitialisation.'}`);
      }
    } catch (err) {
      setMessage('❌ Erreur serveur ou réseau.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">🔒 Réinitialisation du mot de passe</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Réinitialiser
          </button>
        </form>

        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
