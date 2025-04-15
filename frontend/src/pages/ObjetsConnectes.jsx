import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ObjetsConnectes() {
  const [objets, setObjets] = useState([]);
  const [search, setSearch] = useState("");
  const [utilisateur, setUtilisateur] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState(null);
  const [ajouterObjetOuvert, setAjouterObjetOuvert] = useState(false);
  const [bases, setBases] = useState([]);
  const [editionOuverte, setEditionOuverte] = useState(false);
  const [objetEnCours, setObjetEnCours] = useState(null);

  const navigate = useNavigate();

  const TYPES_OBJETS = [
    "Thermostat connecté",
    "Escalateur connecté",
    "Lumière connectée",
    "Compteur électrique"
  ];

  const getPhotoPath = (typeObjet) => {
    const map = {
      "Compteur électrique": "compteur.png",
      "Escalator connecté": "escalator.png",
      "Lumière connectée": "lumiere.png",
      "Thermostat connecté": "thermostat.png"
    };
    return `/objets/${map[typeObjet] || "default.png"}`;
  };
  

  const [formData, setFormData] = useState({
    nom: '',
    typeObjet: '',
    description: '',
    emplacement: ''
  });

  const userId = localStorage.getItem("userId");

  const getNiveau = (points) => {
    if (points < 5) return 1;
    if (points < 10) return 2;
    if (points < 15) return 3;
    return 4;
  };

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:3001/api/objets-connectes?userId=${userId}`)
      .then(res => res.json())
      .then(data => setObjets(data))
      .catch(() => setError("Erreur lors du chargement des objets connectés"));

    fetch(`http://localhost:3001/api/utilisateur/${userId}`)
      .then(res => res.json())
      .then(data => setUtilisateur(data))
      .catch(() => setError("Erreur lors du chargement de l'utilisateur"));

    fetch("http://localhost:3001/api/objets-connectes/bases-donnees")
      .then(res => res.json())
      .then(setBases)
      .catch(() => setError("Erreur lors du chargement des bases"));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const niveau = getNiveau(parseInt(utilisateur?.point || 0));
  const estAdmin = utilisateur?.typeMembre === "admin";

  const objetsFiltres = objets.filter((obj) =>
    obj.nom.toLowerCase().includes(search.toLowerCase()) ||
    obj.typeObjet.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.nom || !formData.typeObjet) {
      alert("❌ Veuillez remplir tous les champs obligatoires.");
      return;
    }
  
    const body = {
      nom: formData.nom,
      typeObjet: formData.typeObjet,
      description: formData.description,
      idPlateforme: 1,
      ajoutePar: parseInt(userId, 10),
      emplacement: formData.emplacement,
      estValide: estAdmin ? 1 : 0 // ✅ Seuls les admins valident directement
    };
  
    try {
      const res = await fetch("http://localhost:3001/api/objets-connectes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      if (res.ok) {
        alert(estAdmin ? "✅ Objet ajouté !" : "✅ Suggestion envoyée, en attente de validation !");
        setAjouterObjetOuvert(false);
        setFormData({ nom: '', typeObjet: '', description: '', emplacement: '' });
  
        const refreshed = await fetch(`http://localhost:3001/api/objets-connectes?userId=${userId}`);
        const data = await refreshed.json();
        setObjets(data);
      } else {
        const errData = await res.json();
        alert("❌ Erreur : " + (errData.error || "Échec de l'ajout."));
      }
    } catch (err) {
      alert("❌ Erreur réseau.");
    }
  };
  

  const startEdit = async (objet) => {
    setEditingId(objet.idObjetConnecte); // important
    setObjetEnCours({
      idObjetConnecte: objet.idObjetConnecte,
      nom: objet.nom,
      description: objet.description || '',
      typeObjet: objet.typeObjet,
      idBase: objet.idBase
    });
    
  
    try {
      const encodedType = encodeURIComponent(objet.typeObjet);
      const resChamps = await fetch(`http://localhost:3001/api/objets-connectes/champs-editables/${encodedType}`);
      const champs = await resChamps.json();
  
      const resDonnees = await fetch(`http://localhost:3001/api/objets-connectes/donnees/${objet.idObjetConnecte}`);
      const donneesDynamiques = await resDonnees.json();
  
      const initialValues = {};
      champs.forEach(c => {
        initialValues[c] = donneesDynamiques[c] ?? "";
      });
  
      setEditData(initialValues);
      setEditionOuverte(true);
    } catch (err) {
      console.error("❌ Erreur chargement des champs ou données dynamiques", err);
    }
  };
  
  
  
  const refreshDonneesDynamiques = async (id) => {
    const res = await fetch(`http://localhost:3001/api/objets-connectes/donnees/${id}`);
    const data = await res.json();
    setEditData(data); // met à jour les champs visibles
  };
  
  const handleUpdate = async () => {
    const id = objetEnCours?.idObjetConnecte;
    if (!id) return alert("ID manquant");
  
    try {
      // 👇 1. D'abord les données générales
      const resMeta = await fetch(`http://localhost:3001/api/objets-connectes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
  
      // 👇 2. Ensuite les métadonnées (nom, description, etc.)
      const resDonnees = await fetch(`http://localhost:3001/api/objets-connectes/objet/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: objetEnCours.nom,
          description: objetEnCours.description,
          typeObjet: objetEnCours.typeObjet,
          idBase: objetEnCours.idBase
        })
      });
  
      if (resDonnees.ok && resMeta.ok) {
        const updated = await fetch(`http://localhost:3001/api/objets-connectes?userId=${userId}`);
        const data = await updated.json();
        setObjets(data);
        await refreshDonneesDynamiques(id);
        setEditingId(null);
        alert("✅ Modifications enregistrées !");
      } else {
        alert("❌ Erreur lors de la mise à jour des données.");
      }
    } catch (err) {
      alert("❌ Erreur réseau.");
    }
  };
  

  const handleDelete = async (id) => {
    if (confirm("Supprimer cet objet ?")) {
      try {
        const res = await fetch(`http://localhost:3001/api/objets-connectes/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setObjets(prev => prev.filter(obj => obj.idObjetConnecte !== id));
          alert("✅ Objet supprimé !");
        } else {
          alert("❌ Erreur lors de la suppression.");
        }
      } catch (err) {
        alert("❌ Erreur réseau.");
      }
    }
  };
  
  console.log("👤 Niveau utilisateur :", niveau);

  
  

  return (
    <div className="p-6">
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex items-center w-full sm:w-auto gap-2 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="🔍 Rechercher par nom ou type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {niveau >= 3 && (
          <button
            onClick={() => setAjouterObjetOuvert(true)}
            className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 shadow-sm transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {niveau === 3 ? "Proposer un objet connecté" : "Proposer un objet connecté"}
          </button>
        )}
      </div>
      {ajouterObjetOuvert && (
  <>
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40" onClick={() => setAjouterObjetOuvert(false)} />
    <div className="fixed top-0 right-0 w-full sm:w-[800px] h-full bg-white z-50 p-8 overflow-y-auto animate-slideIn">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Ajouter un objet connecté</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Type d'objet</label>
          <select
            name="typeObjet"
            value={formData.typeObjet}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-500"
            required
          >
            <option value="">-- Sélectionner un type --</option>
            {TYPES_OBJETS.map((type, i) => (
              <option key={i} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-500"
          />
        </div>

          <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Emplacement</label>
          <input
            type="text"
            name="emplacement"
            value={formData.emplacement}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg"
          >
            ✅ Ajouter l'objet
          </button>
        </div>
      </form>
    </div>
  </>
)}

 
      {editionOuverte && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40" onClick={() => setEditionOuverte(false)} />
          <div className="fixed top-0 right-0 w-full sm:w-[900px] h-full bg-gray-900 text-white z-50 p-8 overflow-y-auto animate-slideIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">{objetEnCours?.nom}</h2>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <img src={getPhotoPath(objetEnCours?.typeObjet)} alt={objetEnCours?.typeObjet} className="w-full rounded-lg shadow border" />
              </div>
              <div className="text-sm space-y-2">
                <p><strong>Type :</strong> {objetEnCours?.typeObjet}</p>
                <p><strong>Description :</strong> {objetEnCours?.description}</p>
                <p><strong>Emplacement :</strong> {objetEnCours?.emplacement}</p>
                <p><strong>Base :</strong> {objetEnCours?.nomBase}</p>
                <p><strong>ID :</strong> {objetEnCours?.idObjetConnecte}</p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6">
            {Object.entries(editData).map(([key, value]) => (
                  <div className="bg-gray-800 p-4 rounded-lg shadow-md" key={key}>
                    <label className="block text-gray-300 mb-2 capitalize">{key.replace(/_/g, ' ')}</label>

                    {key === "vitesse_m_s" && (
                      <div>
                        <div className="text-sm text-orange-300 font-semibold mb-1">{value} m/s</div>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="0.1"
                          value={value}
                          name={key}
                          onChange={handleChange}
                          className="w-full accent-orange-500"
                        />
                      </div>
                    )}

                    {key === "temperature_cible" && (
                      <div>
                        <div className="text-sm text-orange-300 font-semibold mb-1">{value} °C</div>
                        <input
                          type="range"
                          min="10"
                          max="25"
                          step="0.5"
                          value={value}
                          name={key}
                          onChange={handleChange}
                          className="w-full accent-red-500"
                        />
                      </div>
                    )}

                    {key === "courant" && (
                      <div>
                        <div className="text-sm text-orange-300 font-semibold mb-1">{value} A</div>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          step="1"
                          value={value}
                          name={key}
                          onChange={handleChange}
                          className="w-full accent-yellow-500"
                        />
                      </div>
                    )}

                    {key === "tension" && (
                      <div>
                        <div className="text-sm text-orange-300 font-semibold mb-1">{value} V</div>
                        <input
                          type="range"
                          min="200"
                          max="250"
                          step="1"
                          value={value}
                          name={key}
                          onChange={handleChange}
                          className="w-full accent-green-500"
                        />
                      </div>
                    )}

                    {key === "luminosite" && (
                      <div>
                        <div className="text-sm text-orange-300 font-semibold mb-1">{value} %</div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={value}
                          name={key}
                          onChange={handleChange}
                          className="w-full accent-cyan-500"
                        />
                      </div>
                    )}

                    {key === "sens" && (
                      <div className="flex gap-2">
                        {["montée", "descente"].map(opt => (
                          <button
                            key={opt}
                            onClick={() => handleChange({ target: { name: key, value: opt } })}
                            className={`px-4 py-1 rounded-full text-sm ${value === opt ? "bg-blue-600 text-white" : "bg-gray-600"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {["etat", "etat_enregistrement"].includes(key) && (
                      <div className="flex gap-2">
                        {["marche", "arrêt"].map(opt => (
                          <button
                            key={opt}
                            onClick={() => handleChange({ target: { name: key, value: opt } })}
                            className={`px-4 py-1 rounded-full text-sm ${value === opt ? "bg-green-600 text-white" : "bg-gray-600"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {key === "mode" && (
                      <div className="flex gap-2">
                        {["auto", "manuel", "eco"].map(opt => (
                          <button
                            key={opt}
                            onClick={() => handleChange({ target: { name: key, value: opt } })}
                            className={`px-4 py-1 rounded-full text-sm ${value === opt ? "bg-indigo-600 text-white" : "bg-gray-600"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {key === "resolution" && (
                      <div className="flex gap-2">
                        {["720p", "1080p", "4K"].map(opt => (
                          <button
                            key={opt}
                            onClick={() => handleChange({ target: { name: key, value: opt } })}
                            className={`px-4 py-1 rounded-full text-sm ${value === opt ? "bg-purple-600 text-white" : "bg-gray-600"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {key === "maintenance_prevue" || key === "derniere_inspection" ? (
                      <div className="flex gap-2">
                        {["1 mois", "2 mois", "3 mois+"].map(opt => (
                          <button
                            key={opt}
                            onClick={() => handleChange({ target: { name: key, value: opt } })}
                            className={`px-4 py-1 rounded-full text-sm ${value === opt ? "bg-yellow-600 text-white" : "bg-gray-600"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {/* Fallback */}
                    {![
                      "vitesse_m_s",
                      "temperature_cible",
                      "courant",
                      "tension",
                      "luminosite",
                      "sens",
                      "etat",
                      "etat_enregistrement",
                      "mode",
                      "resolution",
                      "maintenance_prevue",
                      "derniere_inspection"
                    ].includes(key) && (
                      <input
                        type="text"
                        name={key}
                        value={value}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
                <div className="mt-6 col-span-2 flex justify-end">
  <button
    onClick={() => handleUpdate(objetEnCours?.idObjetConnecte)}
    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow"
  >
    ✅ Enregistrer les modifications
  </button>
</div>


            </div>
          </div>
        </>
      )}

      {objetsFiltres.length === 0 ? (
        <p className="text-gray-500 mt-6">Aucun objet connecté trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {objetsFiltres.map(objet => (
            <div key={objet.idObjetConnecte} className="border p-4 rounded shadow bg-white">
              <h3 className="text-lg font-bold">{objet.nom}</h3>
              <p className="text-sm text-gray-600">{objet.typeObjet}</p>
              <p className="text-sm mt-1">{objet.description}</p>
              {objet.nomBase && <p className="text-xs text-gray-400 mt-2">Base associée : {objet.nomBase}</p>}
              {(estAdmin || niveau === 4) && (
                <div className="flex justify-between items-center mt-3">
                  <button
                    onClick={() => startEdit(objet)}
                    className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15H9v-2z" />
                    </svg>
                    Modifier
                  </button>

                  {niveau === 4 && (
                    <button
                      onClick={() => handleDelete(objet.idObjetConnecte)}
                      className="text-red-600 text-sm hover:text-red-700 flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Supprimer
                    </button>
                  )}
                </div>
              )}
            </div>
          ))} 
        </div>
      )}
    </div>
  );
}

export default ObjetsConnectes;
