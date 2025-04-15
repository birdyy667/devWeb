import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function ThermostatDashboard() {
  const { id } = useParams();
  const [donnees, setDonnees] = useState([]);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/objets-connectes/rapport");
        const objets = await res.json();
        const objet = objets.find(obj => obj.idObjet === parseInt(id));
        setMeta(objet);
        setDonnees(objet?.historique || []);
      } catch (err) {
        console.error("Erreur chargement thermostat :", err);
      }
    };
    charger();
  }, [id]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard : {meta?.nom}</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <p className="text-gray-700"><strong>Type :</strong> {meta?.type}</p>
        <p className="text-gray-700"><strong>Emplacement :</strong> {meta?.emplacement}</p>
        <p className="text-gray-700"><strong>Ajouté par :</strong> {meta?.utilisateur}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Évolution de la température</h2>

        {donnees.length === 0 ? (
          <p className="text-gray-500">Aucune donnée disponible.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={donnees}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(str) => new Date(str).toLocaleTimeString()} />
              <YAxis domain={[10, 30]} unit="°C" />
              <Tooltip formatter={(value, name) => [`${value}°C`, "Température"]} labelFormatter={(label) => `Heure : ${new Date(label).toLocaleString()}`} />
              <Line type="monotone" dataKey="temperature_cible" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default ThermostatDashboard;
