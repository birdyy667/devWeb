import { useEffect, useState } from "react";
import donneesObjets from "../donnees";


function Rapport() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(donneesObjets);
  }, []);

  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Rapport des Objets Connectés</h1>

      {data.map((objet) => (
        <div key={objet.idObjet} className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">{objet.nom} ({objet.type})</h2>
          
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100 text-gray-600 uppercase">
              <tr>
                <th className="py-2 px-4 border">Horodatage</th>
                <th className="py-2 px-4 border">Valeur</th>
              </tr>
            </thead>
            <tbody>
              {objet.valeurs.map((v, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 px-4">{new Date(v.timestamp).toLocaleString()}</td>
                  <td className="py-2 px-4">{v.valeur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default Rapport;
