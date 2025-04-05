import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



function Register() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        motDePasse: '',
        nom: '',
        prenom: '',
        typeMembre: '',
        photo: '',
        age: '',
        genre: '',
        dateNaissance: '',
        point: 0,
        idStatut: 1,
        idEmplacement: 1,
        idPlateforme: 1,
      });
      

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Compte créé avec succès ✅');
        localStorage.setItem('userId', data.userId);
        navigate('/dashboard'); // ⬅️ Redirige vers le dashboard

      } else {
        setMessage(`Erreur : ${data.error}`);
      }
    } catch (err) {
      console.error('❌ Erreur côté client :', err);
      setMessage("Une erreur est survenue lors de l'envoi.");
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Créer un compte</h2>
      <form onSubmit={handleSubmit}>
  <input name="email" type="email" placeholder="Email" onChange={handleChange} value={formData.email} required /><br />
  <input name="motDePasse" type="password" placeholder="Mot de passe" onChange={handleChange} value={formData.motDePasse} required /><br />
  <input name="nom" placeholder="Nom" onChange={handleChange} value={formData.nom} /><br />
  <input name="prenom" placeholder="Prénom" onChange={handleChange} value={formData.prenom} /><br />
  <input name="typeMembre" placeholder="Type de membre" onChange={handleChange} value={formData.typeMembre} /><br />
  <input name="photo" placeholder="Lien de la photo" onChange={handleChange} value={formData.photo} /><br />
  <input name="age" type="number" placeholder="Âge" onChange={handleChange} value={formData.age} /><br />
  <input name="genre" placeholder="Genre" onChange={handleChange} value={formData.genre} /><br />
  <input name="dateNaissance" type="date" onChange={handleChange} value={formData.dateNaissance} /><br />
  <button type="submit">Créer mon compte</button>
</form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
