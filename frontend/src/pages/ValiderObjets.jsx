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

    // 🔐 Vérifier si l'utilisateur est un admin
    fetch(`http://localhost:3001/api/utilisateur/${userId}`)
      .then((res) => res.json())
      .then((user) => {
        if (user.typeMembre !== "admin") {
          setError("Accès réservé aux administrateurs.");
          return;
        }
        setUtilisateur(user);

        // 🔄 Charger les objets à valider uniquement si l'utilisateur est admin
        fetch("http://localhost:3001/api/objets-connectes/a-valider")
          .then((res) => res.json())
          .then((data) => setObjets(data))
          .catch((err) => {
            console.error("❌ Erreur :", err);
            setError("Erreur lors du chargement des objets à valider");
          });
      })
      .catch(() => setError("Erreur lors de la vérification des droits."));
  }, [userId]);

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
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🔒 Objets en attente de validation</h2>

      {error && <p className="text-red-500">{error}</p>}

      {!error && objets.length === 0 && (
        <p className="text-gray-500">Aucun objet à valider.</p>
      )}

      {!error && objets.length > 0 && (
        <div className="space-y-4">
          {objets.map((obj) => (
            <div key={obj.idObjetConnecte} className="p-4 bg-white shadow rounded">
              <h3 className="font-semibold text-lg">{obj.nom}</h3>
              <p className="text-sm text-gray-500 mb-1">Type : {obj.typeObjet}</p>
              <p className="text-sm italic text-gray-600 mb-2">{obj.description}</p>
              <pre className="bg-gray-100 text-sm p-2 rounded overflow-x-auto">
                    {(() => {
                        try {
                        const data = typeof obj.outils === "string" ? JSON.parse(obj.outils) : obj.outils;
                        return JSON.stringify(data, null, 2);
                        } catch (e) {
                        return "⚠️ Format JSON invalide";
                        }
                    })()}
            </pre>

              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => validerObjet(obj.idObjetConnecte)}
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                >
                  ✅ Valider
                </button>
                <button
                  onClick={() => supprimerObjet(obj.idObjetConnecte)}
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                >
                  ❌ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 underline"
        >
          ← Retour au dashboard
        </button>
      </div>
    </div>
  );
}

export default ValiderObjets;
