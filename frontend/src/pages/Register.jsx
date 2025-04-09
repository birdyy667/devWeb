import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. importer


function Inscription() {

  const navigate = useNavigate(); // 2. déclarer


  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    age: '',
    genre: '',
    dateDeNaissance: '',
    photo: null,
    typeMembre: 'standard',         // valeur par défaut
    point: 0,                       // valeur par défaut
    idStatut: 1,                   // valeur par défaut
    idEmplacement: 1,
    idPlateforme: 1
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    for (let key in formData) {
      formDataToSend.append(key, formData[key]);
    }
  
    console.log("📤 Envoi du formulaire...", formData);
  
    try {
      const res = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        body: formDataToSend
      });
  
      console.log("📥 Réponse brute :", res);
  
      let data = {};
      try {
        data = await res.json();
        console.log("📦 Réponse JSON :", data);
      } catch (jsonErr) {
        console.warn("⚠️ Impossible de parser la réponse JSON :", jsonErr);
      }
  
      if (res.ok) {
        setMessage('🎉 Compte créé avec succès !');
        navigate('/connexion');
      } else if (res.status === 409) {
        setMessage('❌ Cet email est déjà utilisé.');
      } else {
        setMessage(`❌ Erreur serveur : ${data?.error || 'Erreur inconnue'}`);
      }
    } catch (err) {
      console.error('❌ Erreur FETCH (réseau ou crash serveur) :', err);
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
        <h2 className="text-2xl font-semibold mb-6 text-center">Créer un compte</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="prenom"
            type="text"
            placeholder="Prénom"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="nom"
            type="text"
            placeholder="Nom"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
          <input
            name="age"
            type="number"
            placeholder="Âge"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="genre"
            type="text"
            placeholder="Genre"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="dateDeNaissance"
            type="date"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="photo"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Créer mon compte
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-red-600">
            {message}
          </p>
        )}
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <span>Déjà inscrit ? </span>
          <button
            onClick={() => navigate('/connexion')}
            className="text-blue-600 hover:underline font-medium"
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}

export default Inscription;
