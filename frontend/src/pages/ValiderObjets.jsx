import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ValiderObjets() {
  const [objets, setObjets] = useState([]);
  const [error, setError] = useState(null);
  const [utilisateur, setUtilisateur] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setError("Accès refusé. Connectez-vous.");
      return;
    }
  
    fetch(`http://localhost:3001/api/utilisateur/${userId}`)
      .then((res) => res.json())
      .then((user) => {
        setUtilisateur(user);
  
        const niveau = getNiveau(user.point || 0);
        const estAdmin = user.typeMembre === "admin" || niveau >= 5;
  
        // Niveau trop bas
        if (niveau < 4 && !estAdmin) {
          setError("⛔️ Vous n’avez pas le niveau requis pour accéder à cette page.");
          return;
        }
  
        fetch("http://localhost:3001/api/objets-connectes/a-valider")
          .then((res) => res.json())
          .then((data) => {
            if (estAdmin) {
              setObjets(data); // Admins voient tout
            } else {
              // Niveau 4 : ne voir que ses propres suggestions
              const suggestionsPerso = data.filter(obj => obj.ajoutePar === user.idUtilisateur);
              setObjets(suggestionsPerso);
            }
          })
          .catch(() => setError("Erreur lors du chargement des objets à valider"));
      })
      .catch(() => setError("Erreur lors de la vérification des droits."));
  }, [userId]);
  
  const getNiveau = (points) => {
    if (points < 5) return 1;
    if (points < 10) return 2;
    if (points < 15) return 3;
    if (points < 20) return 4;
    return 5;
  };
  

  const validerObjet = async (id) => {
    const res = await fetch(`http://localhost:3001/api/objets-connectes/valider/${id}`, {
      method: "PUT",
    });
    if (res.ok) {
      setObjets((prev) => prev.filter((obj) => obj.idObjetConnecte !== id));
    }
  };

  const supprimerObjet = async (id) => {
    if (confirm("Supprimer cet objet ?")) {
      const res = await fetch(`http://localhost:3001/api/objets-connectes/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setObjets((prev) => prev.filter((obj) => obj.idObjetConnecte !== id));
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">🔒 Objets en attente de validation</h2>
  
      {error && <p className="text-red-500 text-center">{error}</p>}
  
      {!error && objets.length === 0 && (
        <p className="text-gray-500 text-center">Aucun objet à valider.</p>
      )}
  
      {!error && objets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {objets.map((obj) => (
            <div key={obj.idObjetConnecte} className="bg-white p-4 rounded-lg shadow-md relative">
              <h3 className="font-semibold text-lg text-center">{obj.nom}</h3>
              <p className="text-sm text-gray-500 text-center mb-1">Type : {obj.typeObjet}</p>
              <p className="text-sm italic text-gray-600 text-center mb-3">{obj.description}</p>
  
              <pre className="bg-gray-100 text-sm p-2 rounded max-h-32 overflow-y-auto text-gray-800">
                {(() => {
                  try {
                    const data = typeof obj.outils === "string" ? JSON.parse(obj.outils) : obj.outils;
                    return JSON.stringify(data, null, 2);
                  } catch (e) {
                    return "⚠️ Format JSON invalide";
                  }
                })()}
              </pre>
  
              {utilisateur && (utilisateur.typeMembre === "admin" || getNiveau(utilisateur.point) >= 5) && (
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => validerObjet(obj.idObjetConnecte)}
                    className="flex items-center gap-1  text-blue-600 px-3 py-1.5 hover:text-blue-700 "
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Valider
                  </button>
  
                  <button
                    onClick={() => supprimerObjet(obj.idObjetConnecte)}
                    className="flex items-center gap-1 text-red-600 px-3 py-1.5 hover:text-red-700 "
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
  
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 underline hover:text-blue-800"
        >
          ← Retour au dashboard
        </button>
      </div>
    </div>
  );
  
}

export default ValiderObjets;
