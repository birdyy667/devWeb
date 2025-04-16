import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Thermometer, Zap, Lightbulb, Gauge } from "lucide-react";


function ObjetsConnectes() {
  const [objets, setObjets] = useState([]);
  const [search, setSearch] = useState("");
  const [objetsEnAttente, setObjetsEnAttente] = useState([]);
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
  
    const chargerInfos = async () => {
      try {
        // 1. Charger les objets visibles par l'utilisateur
        const resObjets = await fetch(`http://localhost:3001/api/objets-connectes?userId=${userId}`);
        const objetsData = await resObjets.json();
        setObjets(objetsData);
  
        // 2. Charger les infos utilisateur
        const resUser = await fetch(`http://localhost:3001/api/utilisateur/${userId}`);
        const userData = await resUser.json();
        setUtilisateur(userData);
  
        // 3. Charger les bases de données associées
        const resBases = await fetch("http://localhost:3001/api/objets-connectes/bases-donnees");
        const basesData = await resBases.json();
        setBases(basesData);
  
        // 4. Si admin ou niveau ≥ 4 → chercher les objets en attente
        const niveau = getNiveau(userData.point || 0);
        const estAdmin = userData.typeMembre === "admin";
  
        if (estAdmin || niveau >= 4) {
          const resEnAttente = await fetch("http://localhost:3001/api/objets-connectes/a-valider");
          const allToValidate = await resEnAttente.json();
  
          const filtres = estAdmin
            ? allToValidate
            : allToValidate.filter(obj => obj.ajoutePar === userData.idUtilisateur);
  
          setObjetsEnAttente(filtres);
        }
      } catch (err) {
        console.error("❌ Erreur globale dans le useEffect :", err);
        setError("Une erreur est survenue lors du chargement des données.");
      }
    };
  
    chargerInfos();
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
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Rechercher par nom ou type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            {niveau === 3 ? "Ajouter un objet connecté" : "Ajouter un objet connecté"}
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
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
                  >
                    Ajouter l'objet
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

 
      {editionOuverte && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40" onClick={() => setEditionOuverte(false)} />
          <div className="fixed top-0 right-0 w-full sm:w-[900px] h-full bg-white text-gray-800 z-50 p-8 overflow-y-auto animate-slideIn">            <div className="flex justify-between items-center mb-6">
            </div>

            <div className="text-center flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-4">
              {objetEnCours?.typeObjet.includes("Thermostat") && <Thermometer size={42} />}
              {["Escalator", "Escalateur"].some(t => objetEnCours?.typeObjet.includes(t)) && <Zap size={42} />}
              {objetEnCours?.typeObjet.includes("Lumière") && <Lightbulb size={42} />}
              {objetEnCours?.typeObjet.includes("Compteur") && <Gauge size={42} />}
            </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-1">{objetEnCours?.nom}</h2>
              <p className="text-gray-600 italic">{objetEnCours?.description}</p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6">
            {Object.entries(editData).map(([key, value]) => (
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm" key={key}>
              <label className="block text-black-300 mb-2 capitalize">{key.replace(/_/g, ' ')}</label>

                  {key === "vitesse_m_s" && (
                    <div>
                      <div className="flex items-center justify-between text-blue-600 font-semibold text-sm mb-2">
                        <span>{value} m/s</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={value}
                        name={key}
                        onChange={handleChange}
                        className="w-full h-2 rounded-lg appearance-none bg-gray-200 accent-blue-600 cursor-pointer"
                      />
                    </div>
                  )}

                  {key === "temperature_cible" && (
                    <div>
                      <div className="flex items-center justify-between text-blue-600 font-semibold text-sm mb-2">
                        <span>{value} °C</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="25"
                        step="0.5"
                        value={value}
                        name={key}
                        onChange={handleChange}
                        className="w-full h-2 rounded-lg appearance-none bg-gray-200 accent-blue-600 cursor-pointer"
                      />
                    </div>
                  )}

                  {key === "courant" && (
                    <div>
                      <div className="flex items-center justify-between text-blue-600 font-semibold text-sm mb-2">
                        <span>{value} A</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        step="1"
                        value={value}
                        name={key}
                        onChange={handleChange}
                        className="w-full h-2 rounded-lg appearance-none bg-gray-200 accent-blue-600 cursor-pointer"
                      />
                    </div>
                  )}

                  {key === "tension" && (
                    <div>
                      <div className="flex items-center justify-between text-blue-600 font-semibold text-sm mb-2">
                        <span>{value} V</span>
                      </div>
                      <input
                        type="range"
                        min="200"
                        max="250"
                        step="1"
                        value={value}
                        name={key}
                        onChange={handleChange}
                        className="w-full h-2 rounded-lg appearance-none bg-gray-200 accent-blue-600 cursor-pointer"
                      />
                    </div>
                  )}

                  {key === "luminosite" && (
                    <div>
                      <div className="flex items-center justify-between text-blue-600 font-semibold text-sm mb-2">
                        <span>{value} %</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={value}
                        name={key}
                        onChange={handleChange}
                        className="w-full h-2 rounded-lg appearance-none bg-gray-200 accent-blue-600 cursor-pointer"
                      />
                    </div>
                  )}

                      {key === "sens" && (
                        <div>
                          <div className="flex gap-2">
                            {["montée", "descente"].map(opt => (
                              <button
                                key={opt}
                                onClick={() => handleChange({ target: { name: key, value: opt } })}
                                className={`px-4 py-1 rounded-full text-sm border transition ${
                                  value === opt
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ETAT */}
                      {["etat", "etat_enregistrement"].includes(key) && (
                        <div>
                          <div className="flex gap-2">
                            {["marche", "arrêt"].map(opt => (
                              <button
                                key={opt}
                                onClick={() => handleChange({ target: { name: key, value: opt } })}
                                className={`px-4 py-1 rounded-full text-sm border transition ${
                                  value === opt
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* MODE */}
                      {key === "mode" && (
                        <div>
                          <div className="flex gap-2">
                            {["auto", "manuel", "eco"].map(opt => (
                              <button
                                key={opt}
                                onClick={() => handleChange({ target: { name: key, value: opt } })}
                                className={`px-4 py-1 rounded-full text-sm border transition ${
                                  value === opt
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* RÉSOLUTION */}
                      {key === "resolution" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2"></label>
                          <div className="flex gap-2">
                            {["720p", "1080p", "4K"].map(opt => (
                              <button
                                key={opt}
                                onClick={() => handleChange({ target: { name: key, value: opt } })}
                                className={`px-4 py-1 rounded-full text-sm border transition ${
                                  value === opt
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}  

                    {/* MAINTENANCE / INSPECTION */}
                    {["maintenance_prevue", "derniere_inspection"].includes(key) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2 capitalize">
                          {key.replace("_", " ")}
                        </label>
                        <div className="flex gap-2">
                          {["1 mois", "2 mois", "3 mois+"].map(opt => (
                            <button
                              key={opt}
                              onClick={() => handleChange({ target: { name: key, value: opt } })}
                              className={`px-4 py-1 rounded-full text-sm border transition ${
                                value === opt
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

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
                        className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
            <div className="mt-6 col-span-2 flex justify-end">
              <button
                onClick={() => handleUpdate(objetEnCours?.idObjetConnecte)}
                className="inline-flex items-center px-6 py-2 text-sm font-semibold rounded-md shadow-sm bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Enregistrer la configuration
              </button>
          </div>


            </div>
          </div>
        </>
      )}

      {objetsFiltres.length === 0 ? (
        <p className="text-gray-500 mt-6">Aucun objet connecté trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {objetsFiltres.map((objet) => {
          const donnees = objet.derniereDonnee || {};
          const type = objet.typeObjet;

          let icone, attributs = [], etiquette;

          if (type.includes("Thermostat")) {
            icone = <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center"><Thermometer size={48} /></div>;
            if (donnees.temperature_cible) attributs.push({ nom: "Température", valeur: `${donnees.temperature_cible}°C`, style: "bg-blue-100 text-blue-600" });
            if (donnees.mode) etiquette = donnees.mode;
          } else if (type.includes("Escalator") || type.includes("Escalateur")) {
            icone = <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center"><Zap size={48} /></div>;
            if (donnees.vitesse_m_s) attributs.push({ nom: "Vitesse", valeur: `${donnees.vitesse_m_s} m/s`, style: "bg-cyan-100 text-cyan-600" });
            if (donnees.sens) etiquette = donnees.sens;
          } else if (type.includes("Lumière")) {
            icone = <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center"><Lightbulb size={48} /></div>;
            if (donnees.luminosite) attributs.push({ nom: "Luminosité", valeur: `${donnees.luminosite}%`, style: "bg-yellow-100 text-yellow-600" });
            if (donnees.mode) etiquette = donnees.mode;
          } else if (type.includes("Compteur")) {
            icone = <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center"><Gauge size={48} /></div>;
            if (donnees.courant && donnees.tension) attributs.push({ nom: "Électricité", valeur: `${donnees.courant}A / ${donnees.tension}V`, style: "bg-green-100 text-green-600" });
            etiquette = "En ligne";
          }

          return (
            <div key={objet.idObjetConnecte} className="bg-white rounded-xl border shadow p-6 relative flex flex-col items-center text-center">
              {/* Icône + Titre */}
              <div className="flex flex-col items-center gap-2 mb-4">
                {icone}
                <h3 className="text-md font-semibold text-gray-800">{objet.nom}</h3>
              </div>

              {/* Attributs principaux */}
              <div className="flex flex-col items-center gap-1 mb-2">
                {attributs.map((attr, i) => (
                  <span key={i} className={`text-xs px-2 py-1 rounded-full font-medium ${attr.style}`}>{attr.nom} : {attr.valeur}</span>
                ))}
              </div>

              {/* Badge d'étiquette */}
              {etiquette && (
                <span className={`text-xs px-2 py-1 rounded-full font-medium mb-2
                  ${["auto", "manuel", "eco"].includes(etiquette) ? "bg-indigo-100 text-indigo-600"
                    : ["montée", "descente"].includes(etiquette) ? "bg-blue-100 text-blue-600"
                    : ["marche", "En ligne"].includes(etiquette) ? "bg-green-100 text-green-600"
                    : ["arrêt"].includes(etiquette) ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"}`}
                >
                  {etiquette}
                </span>
              )}

              {/* Description */}
              <p className="text-xs text-gray-500 mb-4">{objet.description}</p>

              {/* Base associée */}
              {objet.nomBase && (
                <p className="text-xs text-gray-400">Base : {objet.nomBase}</p>
              )}

              {/* Actions */}
              <div className="flex gap-4 mt-4">
              {niveau >= 3 && (
                <button
                  onClick={() => startEdit(objet)}
                  className="px-4 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Configurer
                </button>
              )}

                {niveau >= 4 && (
                  <button
                    onClick={() => handleDelete(objet.idObjetConnecte)}
                    className="px-4 py-1 text-sm text-red-600 border border-red-500 rounded hover:bg-red-50"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          );
        })}
</div>


      )}
    </div>
  );
}

export default ObjetsConnectes;
