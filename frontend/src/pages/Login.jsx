import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
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
        setMessage(`🎉 Bienvenue, ${data.utilisateur.email} !`);
        localStorage.setItem('userId', data.utilisateur.id);
        navigate('/dashboard');
      } else {
        setMessage(`❌ Erreur : ${data.error}`);
      }
    } catch (err) {
      console.error('Erreur côté client :', err);
      setMessage('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-blue-700 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

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
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="motDePasse"
            type="password"
            placeholder="Mot de passe"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Se connecter
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-red-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
