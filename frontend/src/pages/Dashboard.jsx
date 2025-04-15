import { useState, useEffect } from 'react';
import ForgotPassword from './ForgotPassword';

function Dashboard() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [message, setMessage] = useState('');
  const [modificationEnCours, setModificationEnCours] = useState(false);
  const [formData, setFormData] = useState({});
  const [showForgotModal, setShowForgotModal] = useState(false);

  const userId = localStorage.getItem('userId');

  const getNiveauEtLibelle = (points) => {
    if (points < 5) return { niveau: 1, libelle: "Débutant" };
    if (points < 10) return { niveau: 2, libelle: "Intermédiaire" };
    if (points < 15) return { niveau: 3, libelle: "Confirmé" };
    return { niveau: 4, libelle: "Expert" };
  };

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
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        dataToSend.append(key, formData[key]);
      }
    }

    try {
      const res = await fetch(`http://localhost:3001/api/utilisateur/${userId}`, {
        method: 'PUT',
        body: dataToSend
      });

      const data = await res.json();
      setMessage(data.message || '✅ Informations mises à jour !');
      setModificationEnCours(false);

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

  const niveauInfo = getNiveauEtLibelle(utilisateur.point);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center font-sans">
  <div className="bg-white w-full max-w-5xl shadow-lg rounded-xl flex min-h-[calc(100vh-3rem)]">        {/* Sidebar info */}
  <aside className="w-64 border-r p-6">
  <div className="flex flex-col items-center space-y-4">
    {/* Niveau + Libellé sur une ligne */}
    <div
      className="flex items-center px-3 py-1 rounded-full text-white text-sm font-medium"
      style={{
        backgroundColor:
          niveauInfo.niveau === 1 ? '#9CA3AF' :
          niveauInfo.niveau === 2 ? '#3B82F6' :
          niveauInfo.niveau === 3 ? '#8B5CF6' :
          '#10B981'
      }}
    >
      {niveauInfo.libelle} <span className="ml-2 font-bold">({niveauInfo.niveau})</span>
    </div>

    {/* Rôle utilisateur */}
    <p className="text-sm text-gray-500 text-center capitalize">
      {utilisateur.typeMembre === 'admin' ? 'Administrateur' : 'Membre standard'}
    </p>
  </div>
</aside>


        {/* Main */}
        <main className="flex-1 p-8 flex flex-col justify-between min-h-[700px]">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {utilisateur.prenom} {utilisateur.nom}
            </h2>

            {message && (
              <p className="mb-4 text-green-600 font-medium">{message}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center space-x-6">
                <img
                src={utilisateur.photo ? `http://localhost:3001/uploads/${utilisateur.photo}` : '/logos/photodefault.webp'} alt="Avatar"
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
                  <label className="text-sm text-gray-600 font-medium">Email</label>
                  <input
                    type="text"
                    disabled
                    value={utilisateur.email}
                    className="w-full mt-1 px-3 py-2 border rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Nom</label>
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
                  <label className="text-sm text-gray-600 font-medium">Prénom</label>
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
                  <label className="text-sm text-gray-600 font-medium">Âge</label>
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
                  <label className="text-sm text-gray-600 font-medium">Genre</label>
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
                  <label className="text-sm text-gray-600 font-medium">Date de naissance</label>
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
            </form>
          </div>

          {/* Zone d’action alignée en bas */}
          <div className="flex justify-between items-center pt-12">
            <div className="text-sm">
              <p className="text-gray-600">Mot de passe oublié ?</p>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-blue-600 hover:underline font-medium"
              >
                Réinitialiser mon mot de passe
              </button>
            </div>

            <div>
              {modificationEnCours ? (
                <div className="flex gap-3">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Sauvegarder
                  </button>
                  <button
                    type="button"
                    onClick={() => setModificationEnCours(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <button
                    type="button"
                    onClick={() => setModificationEnCours(true)}
                    className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15H9v-2z" />
                    </svg>
                    Modifier mes infos
              </button>

              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal oubli mot de passe */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setShowForgotModal(false)}>
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
            <ForgotPassword onSuccess={() => setShowForgotModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
