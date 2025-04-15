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
    "Alarme intrusion",
    "Porte connectée",
    "Thermostat connecté",
    "Caisse connectée",
    "Escalator connecté",
    "Lumière connectée",
    "Compteur électrique"
  ];

  const getPhotoPath = (typeObjet) => {
    const map = {
      "Alarme intrusion": "alarme.png",
      "Caméra connectée": "camera.png",
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
    idBase: '',
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
    setEditData({ ...editData, [name]: value });
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

    if (!formData.nom || !formData.typeObjet || !formData.idBase) {
      alert("❌ Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const body = {
      nom: formData.nom,
      typeObjet: formData.typeObjet,
      description: formData.description,
      idBase: parseInt(formData.idBase, 10),
      idPlateforme: 1,
      ajoutePar: parseInt(userId, 10)
    };

    try {
      const res = await fetch("http://localhost:3001/api/objets-connectes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert("✅ Objet ajouté !");
        setAjouterObjetOuvert(false);
        setFormData({ nom: '', typeObjet: '', description: '', idBase: '' });

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
    setEditingId(objet.idObjetConnecte);
    setEditData({});
    setObjetEnCours(objet); // si utilisé pour afficher la fiche
  
    try {
      const encodedType = encodeURIComponent(objet.typeObjet);
      const res = await fetch(`http://localhost:3001/api/objets-connectes/champs-editables/${encodedType}`);
  
      if (!res.ok) {
        console.error("❌ Erreur API :", res.status);
        return;
      }
  
      const champs = await res.json();
  
      if (!Array.isArray(champs)) {
        console.error("❌ Format invalide des champs :", champs);
        return;
      }
  
      const initialValues = {};
      champs.forEach(c => initialValues[c] = objet[c] || "");
  
      setEditData(initialValues);
      setEditionOuverte(true); // 👉 Ouvre la slide bar ici
    } catch (err) {
      console.error("❌ Erreur chargement champs modifiables", err);
    }
  };
  

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/api/objets-connectes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        const updated = await fetch(`http://localhost:3001/api/objets-connectes?userId=${userId}`);
        const data = await updated.json();
        setObjets(data);
        setEditingId(null);
        setEditionOuverte(false);
      } else {
        alert("❌ Erreur lors de la mise à jour.");
      }
    } catch (err) {
      alert("❌ Erreur réseau.");
    }
  };

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
            {niveau === 4 ? "Ajouter un objet connecté" : "Proposer un objet connecté"}
          </button>
        )}
      </div>

 
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
              {estAdmin && (
                <button onClick={() => startEdit(objet)} className="text-blue-600 text-sm mt-2 hover:underline">Consulter</button>
              )}
            </div>
          ))} 
        </div>
      )}
    </div>
  );
}

export default ObjetsConnectes;
