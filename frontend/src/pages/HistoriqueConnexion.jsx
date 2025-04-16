import { useEffect, useState } from "react";
import { Search } from "lucide-react";

function HistoriqueConnexion() {
  const [historique, setHistorique] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setMessage("Aucun utilisateur connecté.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3001/api/historique/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur serveur");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setHistorique(data);
        } else {
          setMessage("Format de données invalide.");
        }
      })
      .catch((err) => {
        console.error("Erreur :", err);
        setMessage("Impossible de charger l'historique.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const historiqueFiltré = historique.filter((item) =>
    item.prenom.toLowerCase().includes(recherche.toLowerCase())
  );

  if (loading) return <p>Chargement...</p>;
  if (message) return <p className="text-red-500">{message}</p>;

  return (
    <div className="font-sans p-6">
      <h1 className="text-2xl font-bold mb-6">Historique de connexion</h1>

      {/* 🔍 Barre de recherche */}
      <div className="flex items-center mb-4 max-w-md relative">
        <Search className="absolute left-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Rechercher par prénom..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="pl-10 pr-4 py-2 border rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 📋 Tableau historique */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Adresse IP</th>
              <th className="p-3 border">Navigateur</th>
              <th className="p-3 border">Prénom</th>
              <th className="p-3 border">Niveau</th>
            </tr>
          </thead>
          <tbody>
            {historiqueFiltré.length > 0 ? (
              historiqueFiltré.map((item, i) => (
                <tr key={i} className="border-t hover:bg-gray-50 text-center">
                  <td className="p-2 border">{new Date(item.dateConnexion).toLocaleString()}</td>
                  <td className="p-2 border">{item.adresseIP}</td>
                  <td className="p-2 border">{item.navigateur}</td>
                  <td className="p-2 border font-medium">{item.prenom}</td>
                  <td className="p-2 border">
                    <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      item.niveau === 4
                        ? 'bg-green-100 text-green-700'
                        : item.niveau === 3
                        ? 'bg-blue-100 text-blue-700'
                        : item.niveau === 2
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      Niveau {item.niveau}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  Aucun résultat trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoriqueConnexion;
