const donneesObjets = [
  {
    idObjet: 1,
    nom: "Thermostat A",
    type: "thermostat",
    valeurs: [
      { timestamp: "2025-04-12T10:00:00Z", valeur: "21°C" },
      { timestamp: "2025-04-12T11:00:00Z", valeur: "22°C" },
    ],
  },
  {
    idObjet: 2,
    nom: "Capteur de porte B",
    type: "porte",
    valeurs: [
      { timestamp: "2025-04-12T10:05:00Z", valeur: "Ouvert" },
      { timestamp: "2025-04-12T10:15:00Z", valeur: "Fermé" },
    ],
  },
];

export default donneesObjets;
