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
          // Stocke l’ID dans le localStorage
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
    <div style={{ padding: '2rem' }}>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br />
        <input name="motDePasse" type="password" placeholder="Mot de passe" onChange={handleChange} required /><br />
        <button type="submit">Se connecter</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
