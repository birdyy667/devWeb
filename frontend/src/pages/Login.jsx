import { useState } from 'react';

function Login({ onSuccess, onSwitch,onForgotPassword }) {
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userId', data.utilisateur.id);
        onSuccess?.();
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error('Erreur client :', err);
      setMessage('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="font-sans">
      <div className="flex justify-center items-center mb-4">
        <div className="bg-blue-600 w-9 h-9 rounded-lg flex items-center justify-center mr-2">
          <span className="text-white text-lg font-bold">A</span>
        </div>
        <h1 className="text-xl font-bold text-gray-700">Accessly</h1>
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-center">Connexion</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="motDePasse"
          type="password"
          placeholder="Mot de passe"
          value={formData.motDePasse}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Connexion
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-red-600">{message}</p>
      )}

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Mot de passe oublié ?
          </button>
        </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        <span>Pas encore de compte ? </span>
        <button
          onClick={onSwitch}
          className="text-blue-600 hover:underline font-medium"
        >
          S’inscrire
        </button>
      </div>
    </div>
  );
}

export default Login;
