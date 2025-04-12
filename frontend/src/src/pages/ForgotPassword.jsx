import { useState } from 'react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("⏳ Envoi de l'email en cours...");

    try {
      const res = await fetch('http://localhost:3001/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("📬 Si cet email est enregistré, un lien de réinitialisation a été envoyé.");
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-blue-700 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Mot de passe oublié</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Ton adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Réinitialiser mon mot de passe
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
