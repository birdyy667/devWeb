import { useState } from "react";

function Register({ onSuccess, onSwitch }) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    age: "",
    genre: "",
    dateDeNaissance: "",
    typeMembre: "standard",
    idStatut: 1,
    idEmplacement: 1,
    idPlateforme: 1,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toSend = new FormData();
    for (let key in formData) {
      toSend.append(key, formData[key]);
    }

    try {
      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        body: toSend,
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess?.(); // Ferme la modale
      } else if (res.status === 409) {
        setMessage("Cet email est déjà utilisé.");
      } else {
        setMessage(data?.error || "Erreur inconnue");
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur de connexion au serveur");
    }
  };

  return (
    <div className="text-gray-800 font-sans px-6 py-4 w-full max-w-md mx-auto">
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 w-9 h-9 rounded-lg flex items-center justify-center text-white text-lg font-bold">
            A
          </div>
          <span className="text-lg font-semibold">Accessly</span>
        </div>
      </div>

      <h2 className="text-center text-xl font-semibold mb-6">Créer un compte</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="prenom"
          type="text"
          placeholder="Prénom"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="nom"
          type="text"
          placeholder="Nom"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="motDePasse"
          type="password"
          placeholder="Mot de passe"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="age"
          type="number"
          placeholder="Âge"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="genre"
          type="text"
          placeholder="Genre"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="dateDeNaissance"
          type="date"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md text-gray-500 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          S’inscrire
        </button>
      </form>

      {message && (
        <p className="text-sm text-red-600 mt-4 text-center">{message}</p>
      )}

      <div className="mt-6 text-center text-sm text-gray-600">
        <span>Déjà inscrit ? </span>
        <button
          onClick={onSwitch}
          className="text-blue-600 hover:underline font-medium"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}

export default Register;
