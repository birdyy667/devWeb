import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profils.css';


function Profils() {
  const [profils, setProfils] = useState([]);
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const navigate = useNavigate();
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUserData, setNewUserData] = useState({
    nom: '', prenom: '', email: '', motDePasse: '',
    age: '', genre: '', dateNaissance: '',
    typeMembre: 'standard', point: '',
    photo: null,
    idStatut: 1,         
    idEmplacement: 1,      
    idPlateforme: 1        
  });
  const [statutFilter, setStatutFilter] = useState("all"); // all | verifie | non-verifie

  



  useEffect(() => {
    fetch('http://localhost:3001/api/profils-publics')
      .then(res => res.json())
      .then(data => {
        console.log("🧪 Profils récupérés :", data); // ✅ ici c'est bon
        setProfils(data);
      })
      .catch(err => console.error(err));
  
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`http://localhost:3001/api/utilisateur/${userId}`)
        .then(res => res.json())
        .then(user => {
          if (user?.typeMembre === 'admin') setIsAdmin(true);
        });
    }
  }, []);
  

  const getNiveauEtLibelle = (points) => {
    if (points < 5) return { niveau: 1, libelle: "Débutant" };
    if (points < 10) return { niveau: 2, libelle: "Intermédiaire" };
    if (points < 15) return { niveau: 3, libelle: "Confirmé" };
    return { niveau: 4, libelle: "Expert" };
  };

  const handleDelete = async (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      const res = await fetch(`http://localhost:3001/api/utilisateur/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        navigate('/suppression-success');
      } else {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const formData = new FormData();
    Object.keys(editFormData).forEach(key => {
      if (editFormData[key] !== undefined) {
        formData.append(key, editFormData[key]);
      }
    });

    const res = await fetch(`http://localhost:3001/api/utilisateur/${editingUser.idUtilisateur}`, {
      method: 'PUT',
      body: formData
    });

    if (res.ok) {
      const updatedList = await fetch('http://localhost:3001/api/profils-publics');
      const refreshed = await updatedList.json();
      setProfils(refreshed);
      setEditingUser(null);
    } else {
      alert("❌ Échec de la modification.");
    }
  };
  const profilsFiltres = profils.filter((p) => {
    const searchLower = search.toLowerCase();
  
    // Recherche par prénom, nom ou email
    const matchPrenom = p?.prenom?.toLowerCase().includes(searchLower);
    const matchNom = p?.nom?.toLowerCase().includes(searchLower);
    const matchEmail = p?.email?.toLowerCase().includes(searchLower);
    const matchRecherche = matchPrenom || matchNom || matchEmail;
  
    if (!matchRecherche) return false;
  
    // Filtrage par statut uniquement pour les admins
    if (isAdmin) {
      if (statutFilter === "verifie") return p.estVerifie === 1;
      if (statutFilter === "non-verifie") return p.estVerifie === 0;
      return true; // Tous les statuts
    }
  
    // Pour les non-admins : seulement les profils vérifiés
    return p.estVerifie === 1;
  });
  

  const handleCreateChange = (e) => {
    const { name, value, files } = e.target;
    setNewUserData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };
  
  const handleCreateUser = async () => {
    const formData = new FormData();
    for (const key in newUserData) {
      if (newUserData[key] !== null && newUserData[key] !== '') {
        formData.append(key, newUserData[key]);
      }
    }
  
    try {
      const res = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        body: formData
      });
  
      if (res.ok) {
        const data = await res.json();
        alert("✅ Utilisateur créé !");
        setCreatingUser(false);
        setNewUserData({
          nom: '', prenom: '', email: '', motDePasse: '',
          age: '', genre: '', dateNaissance: '',
          typeMembre: 'standard', point: '',
          idStatut: 1, photo: null
        });
        const refreshed = await fetch('http://localhost:3001/api/profils-publics');
        const updated = await refreshed.json();
        setProfils(updated);
      } else {
        const errData = await res.json();
        alert(`❌ Erreur : ${errData.error || 'Création échouée.'}`);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau.");
    }
  };
  

  

  return (
    <div className="relative p-6 bg-gray-100 min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center w-full sm:w-auto gap-2 flex-1">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="🔍 Rechercher par nom, prénom ou email..."
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {isAdmin && (
              <select
                value={statutFilter}
                onChange={(e) => setStatutFilter(e.target.value)}
                className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="verifie">Vérifiés</option>
                <option value="non-verifie">Non vérifiés</option>
              </select>
            )}
          </div>

      {isAdmin && (
        <button
            onClick={() => setCreatingUser(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Créer un utilisateur
        </button>

      )}
    </div>  


      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${editingUser ? 'lg:grid-cols-2' : ''}`}>
        {profilsFiltres.map(profil => {
          const { niveau, libelle } = getNiveauEtLibelle(profil.point || 0);
          return (
            <div key={profil.idUtilisateur} className="bg-white p-4 rounded-lg shadow-md text-center relative">
              <img
                src={profil.photo ? `http://localhost:3001/uploads/${profil.photo}` : '/logos/photodefault.webp'}
                className="w-28 h-28 rounded-full mx-auto object-cover mb-2 mt-2"
                alt="Profil"
              />
              <div className="text-sm text-gray-500 italic">{libelle}</div>
              <p className="font-semibold text-lg">{profil.prenom}</p>
              {isAdmin && profil.email && (
                <p className="text-sm text-gray-700 break-all">{profil.email}</p>
              )}
              <p className="text-sm text-gray-500 italic">{profil.typeMembre}</p>

              {isAdmin && (
                <>
                  <button
                    onClick={() => {
                      setEditingUser(profil);
                      setEditFormData({ ...profil });
                    }}
                    className="absolute bottom-3 right-4 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15H9v-2z" /></svg>
                    Modifier
                  </button>
                  {profil.typeMembre !== 'admin' && (
                    <button
                      onClick={() => handleDelete(profil.idUtilisateur)}
                      className="absolute bottom-3 left-4 text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
                      Supprimer
                    </button>
                  )}
                </>
              )}
            </div>

          );
        })}

      </div>
      {creatingUser && (
  <>
    {/* Overlay flou */}
    <div
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
      onClick={() => setCreatingUser(false)}
    />

    {/* Modale centrée comme Register, sans logo */}
    <div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-md px-6 py-8 rounded-2xl shadow-xl z-50 font-sans text-gray-800"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-center text-xl font-semibold mb-6">Créer un utilisateur</h2>

      {/* Formulaire style Register */}
      <form className="space-y-4" onSubmit={(e) => {
        e.preventDefault();
        handleCreateUser();
      }}>
        <input
          name="prenom"
          type="text"
          placeholder="Prénom"
          value={newUserData.prenom}
          onChange={handleCreateChange}
          required
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="nom"
          type="text"
          placeholder="Nom"
          value={newUserData.nom}
          onChange={handleCreateChange}
          required
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={newUserData.email}
          onChange={handleCreateChange}
          required
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="motDePasse"
          type="password"
          placeholder="Mot de passe"
          value={newUserData.motDePasse}
          onChange={handleCreateChange}
          required
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="age"
          type="number"
          placeholder="Âge"
          value={newUserData.age}
          onChange={handleCreateChange}
          required
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="genre"
          type="text"
          placeholder="Genre"
          value={newUserData.genre}
          onChange={handleCreateChange}
          required
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="dateNaissance"
          type="date"
          value={newUserData.dateNaissance}
          onChange={handleCreateChange}
          required
          className="w-full px-4 py-2 border rounded-md text-gray-500 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="point"
          type="number"
          placeholder="Points"
          value={newUserData.point}
          onChange={handleCreateChange}
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="typeMembre"
          type="text"
          placeholder="Type de membre"
          value={newUserData.typeMembre}
          onChange={handleCreateChange}
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div>
          <label className="block text-sm text-gray-600 mb-1">Photo de profil</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewUserData({ ...newUserData, photo: e.target.files[0] })}
            className="w-full text-sm"
          />
        </div>

        {/* Boutons */}
        <div className="flex justify-between items-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full transition"
          >
            Créer
          </button>
        </div>
      </form>
    </div>
  </>
)}



      {/* ✅ Sidebar fiche modification */}
      {editingUser && (
  <>
    {/* Overlay fond flou */}
    <div
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
      onClick={() => setEditingUser(null)}
    />

    {/* Sidebar animée à droite */}
    <div
      className="fixed top-16 right-4 h-[90%] w-full sm:w-[500px] bg-white shadow-xl p-6 border rounded-lg z-50 overflow-y-auto animate-slideIn"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl font-semibold text-center mb-6">
        Modifier l'utilisateur
      </h2>

      <form className="space-y-4" onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}>
        <input
          name="prenom"
          placeholder="Prénom"
          value={editFormData.prenom || ""}
          onChange={handleEditChange}
          required
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="nom"
          placeholder="Nom"
          value={editFormData.nom || ""}
          onChange={handleEditChange}
          required
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="age"
          type="number"
          placeholder="Âge"
          value={editFormData.age || ""}
          onChange={handleEditChange}
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="genre"
          placeholder="Genre"
          value={editFormData.genre || ""}
          onChange={handleEditChange}
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="dateNaissance"
          type="date"
          value={editFormData.dateNaissance?.substring(0, 10)}
          onChange={handleEditChange}
          className="w-full px-4 py-2 border rounded-md text-gray-500 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="point"
          type="number"
          placeholder="Points"
          value={editFormData.point || ""}
          onChange={handleEditChange}
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="motDePasse"
          type="password"
          placeholder="Nouveau mot de passe"
          onChange={handleEditChange}
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Sauvegarder
        </button>
      </form>
    </div>
  </>
)}

    </div>

  );
}

export default Profils;
