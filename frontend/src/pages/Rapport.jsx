import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  Tooltip, CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";
import { BarChart2 } from "lucide-react";



const genererMessage = (objet, moyennes, derniereValeur) => {
  const heure = new Date().getHours();
  const type = objet.type;

  if (!derniereValeur) return "Aucune donnée récente disponible.";

  const [cle] = Object.keys(derniereValeur).filter(k => k !== "timestamp");

  const val = derniereValeur[cle];
  const moyenne = moyennes[cle] || 0;

  if (type === "Lumière connectée" && cle === "luminosite") {
    if (val > 80 && heure >= 11 && heure <= 14) {
      return "💡 Baisser la luminosité (lumière forte en plein jour)";
    } else if (val < 30 && heure >= 18) {
      return "⚠️ Luminosité faible en soirée";
    }
  }

  if (type === "Compteur électrique" && cle === "tension") {
    if (val > moyenne * 1.2) {
      return "⚠️ Attention : tension nettement supérieure à la moyenne";
    } else if (val < moyenne * 0.8) {
      return "⚠️ Tension inhabituellement basse";
    }
  }

  if (type === "Thermostat connecté" && cle === "temperature_cible") {
    if (val > 24 && heure >= 12 && heure <= 16) {
      return "🌡️ Température élevée pour l'après-midi";
    }
  }

  return "✅ Tout est OK";
};


function Rapport() {

  const uniteParChamp = {
    temperature_cible: "°C",
    temperature_int: "°C",
    temperature_ext: "°C",
    hygrometrie: "%",
    vitesse_m_s: "m/s",
    consommation_W: "W",
    consommation_totale_kWh: "kWh",
    consommation_journaliere_kWh: "kWh",
    courant: "A",
    tension: "V",
    luminosite: "%",
  };
  const [objets, setObjets] = useState([]);
  useEffect(() => {
    const fetchData = () => {
      axios.get("http://localhost:3001/api/objets-connectes/rapport")
        .then(res => {
          const champsParType = {
            "Thermostat connecté": ["temperature_cible"],
            "Escalator connecté": ["vitesse_m_s"],
            "Caméra connectée": ["etat_enregistrement"],
            "Lumière connectée": ["luminosite"],
            "Compteur électrique": ["courant", "tension"]
          };
  
          const objetsTries = res.data
            .filter(objet => Array.isArray(objet.historique) && objet.type in champsParType)
            .map(objet => {
              const champsUtiles = champsParType[objet.type];
              return {
                ...objet,
                historique: objet.historique
                  .filter(entry => entry.timestamp && !isNaN(new Date(entry.timestamp)))
                  .map(entry => {
                    const filtered = { timestamp: entry.timestamp };
                    champsUtiles.forEach(k => {
                      if (entry[k] !== undefined) filtered[k] = entry[k];
                    });
                    return filtered;
                  })
              };
            })
            .sort((a, b) => {
              const dateA = new Date(a.historique?.at(-1)?.timestamp || 0);
              const dateB = new Date(b.historique?.at(-1)?.timestamp || 0);
              return dateB - dateA;
            });
  
          setObjets(objetsTries);
        })
        .catch(err => console.error("Erreur chargement rapport:", err));
    };
  
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  
  
  const renderGraph = (objet) => {
    if (!objet.historique || objet.historique.length === 0) {
      return <p className="text-sm text-gray-500">Pas de données numériques disponibles</p>;
    }
  
    const rawData = objet.historique.map(item => {
      const entry = { timestamp: new Date(item.timestamp).toLocaleString() };
      for (const key in item) {
        if (key !== "timestamp") {
          const val = item[key];
          entry[key] = (typeof val === "string" && !isNaN(parseFloat(val)))
            ? parseFloat(val)
            : val;
        }
      }
      return entry;
    });
  
    const sample = rawData[0] || {};
    const numericKeys = Object.keys(sample).filter(
      key => key !== "timestamp" && typeof sample[key] === "number"
    );
  
    if (numericKeys.length === 0) {
      return <p className="text-sm text-gray-500">Pas de données numériques disponibles</p>;
    }
  
    const moyennes = {};
    numericKeys.forEach(key => {
      moyennes[key] = rawData.reduce((sum, item) => sum + (item[key] || 0), 0) / rawData.length;
    });
  
    const data = rawData.map(item => {
      const withAverage = { ...item };
      numericKeys.forEach(key => {
        withAverage[`moyenne_${key}`] = moyennes[key];
      });
      return withAverage;
    });
  
    const isBarChart = objet.type.includes("Lumière");
    
  
    return (

      <>
      <ResponsiveContainer width="100%" height={250}>
        {isBarChart ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" hide={data.length > 10} />
            <YAxis tickFormatter={(v) => `${v} ${uniteParChamp[numericKeys[0]] || ''}`} />
            <Tooltip formatter={(value, name) => [`${value} ${uniteParChamp[name.replace("moyenne_", "")] || ''}`, name]} />
            <Legend formatter={(value) => `${value.replace("moyenne_", "")} ${uniteParChamp[value.replace("moyenne_", "")] || ''}`} />
  
            {/* Barres normales */}
            {numericKeys.map((key) => (
              <Bar key={key} dataKey={key} fill="#3182ce" />
            ))}
  
            {/* Moyennes en ligne pointillée */}
            {numericKeys.map((key) => (
              <Line
                key={`moyenne_${key}`}
                type="monotone"
                dataKey={`moyenne_${key}`}
                stroke="#f97316"
                strokeDasharray="5 5"
                dot={false}
                name={`${key} (moyenne)`}
              />
            ))}
          </BarChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" hide={data.length > 10} />
            <YAxis tickFormatter={(v) => `${v} ${uniteParChamp[numericKeys[0]] || ''}`} />
            <Tooltip formatter={(value, name) => [`${value} ${uniteParChamp[name.replace("moyenne_", "")] || ''}`, name]} />
            <Legend formatter={(value) => `${value.replace("moyenne_", "")} ${uniteParChamp[value.replace("moyenne_", "")] || ''}`} />
  
            {/* Courbes normales */}
            {numericKeys.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke="#3182ce"
                strokeWidth={2}
                dot={false}
              />
            ))}
  
            {/* Moyennes */}
            {numericKeys.map((key) => (
              <Line
                key={`moyenne_${key}`}
                type="monotone"
                dataKey={`moyenne_${key}`}
                stroke="#f97316"
                strokeDasharray="5 5"
                dot={false}
                name={`${key} (moyenne)`}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
        
         {/* 💬 Message intelligent juste en dessous du graphique */}
      <div className="mt-2 text-sm text-right text-gray-600 italic bg-gray-50 px-2 py-1 rounded">
        {genererMessage(objet, moyennes, rawData.at(-1))}
      </div>
    </>
    );
  };
  
  

  return (
    <div className="p-8 font-sans">

      <div className="flex items-center gap-2 mb-6">
        <BarChart2 className="text-blue-600" size={28} />
        <h1 className="text-3xl font-bold text-gray-800">Rapport des Objets Connectés</h1>
      </div>

          {objets.map((objet) => (
        <div key={objet.idObjet} className="mb-10 bg-white rounded-lg shadow p-6">
          <div className="mb-2 text-lg font-semibold text-blue-600">{objet.nom} ({objet.type})</div>
          <div className="text-sm text-gray-600 mb-4">
            Emplacement : <span className="font-medium">{objet.emplacement || 'Non précisé'}</span><br />
            Dernière mise à jour : <span className="font-medium">{new Date(objet.historique.at(-1)?.timestamp).toLocaleString()}</span><br />
            Modifié par : <span className="font-medium">{objet.utilisateur}</span>
          </div>
          {renderGraph(objet)}
        </div>
      ))}
    </div>
  );
}

export default Rapport;