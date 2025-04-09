import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [message, setMessage] = useState('');
  const [modificationEnCours, setModificationEnCours] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return setMessage("Utilisateur non connecté.");

    fetch(`http://localhost:3001/api/utilisateur/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUtilisateur(data);
        setFormData({
          nom: data.nom,
          prenom: data.prenom,
          age: data.age,
          genre: data.genre,
          dateNaissance: data.dateNaissance,
          photo: null,
        });
      })
      .catch(() => setMessage("Erreur lors du chargement du profil."));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();
    Object.keys(formData).forEach((key) => dataToSend.append(key, formData[key]));

    try {
      const res = await fetch(`http://localhost:3001/api/utilisateur/${userId}`, {
        method: 'PUT',
        body: dataToSend
      });

      const data = await res.json();
      setMessage(data.message || '✅ Informations mises à jour !');
      setModificationEnCours(false);

      // Refresh user info
      const refreshed = await fetch(`http://localhost:3001/api/utilisateur/${userId}`);
      const newData = await refreshed.json();
      setUtilisateur(newData);
    } catch (err) {
      setMessage("❌ Erreur lors de la mise à jour.");
    }
  };

  if (!utilisateur) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-700 text-xl">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white w-full max-w-5xl shadow-lg rounded-xl flex">
        {/* Sidebar */}
        <aside className="w-64 border-r p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <div>
              <p className="font-bold text-gray-800">{utilisateur.prenom} {utilisateur.nom}</p>
              <p className="text-sm text-gray-500">{utilisateur.typeMembre}</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Mon compte</h2>

          {message && (
            <p className="mb-4 text-green-600 font-medium">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-6">
              <img
                src={utilisateur.photo ? `http://localhost:3001/uploads/${utilisateur.photo}` : '/default-avatar.png'}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border"
              />
              {modificationEnCours && (
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                  className="text-sm"
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 font-medium">Email</label>
                <input
                  type="text"
                  disabled
                  value={utilisateur.email}
                  className="w-full mt-1 px-3 py-2 border rounded bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  disabled={!modificationEnCours}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  disabled={!modificationEnCours}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium">Âge</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  disabled={!modificationEnCours}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium">Genre</label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  disabled={!modificationEnCours}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium">Date de naissance</label>
                <input
                  type="date"
                  name="dateNaissance"
                  value={formData.dateNaissance?.substring(0, 10)}
                  disabled={!modificationEnCours}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded"
                />
              </div>
            </div>

            {modificationEnCours ? (
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Sauvegarder
                </button>
                <button
                  type="button"
                  onClick={() => setModificationEnCours(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setModificationEnCours(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Modifier mes infos
              </button>
            )}

            <div className="mt-8 text-sm">
              <p className="text-gray-600">Mot de passe oublié ?</p>
              <button
                onClick={() => navigate('/mot-de-passe-oublie')}
                type="button"
                className="text-blue-600 hover:underline font-medium"
              >
                Réinitialiser mon mot de passe
              </button>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem('userId');
                window.location.href = '/connexion';
              }}
              type="button"
              className="w-full mt-6 bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Déconnexion
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
