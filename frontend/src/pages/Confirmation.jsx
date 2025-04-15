import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Confirmation() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending'); // pending, success, alreadyUsed, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    // ⛔ Masquer la sidebar si elle est présente
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) sidebar.style.display = "none";

    fetch(`http://localhost:3001/api/confirmation/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message?.includes("activé")) {
          setStatus('success');
          setMessage("🎉 Ton adresse email a bien été confirmée !");
          setTimeout(() => {
            window.location.href = "/?open=login"; // ✅ redirection landing + login
          }, 4000);
        } else if (data.error === "Lien invalide ou expiré") {
          setStatus('alreadyUsed');
          setMessage("✅ Ton email est probablement déjà confirmé.");
          setTimeout(() => {
            window.location.href = "/?open=login"; // ✅ même redirection
          }, 4000);
        } else {
          setStatus('error');
          setMessage(data.error || "❌ Une erreur s’est produite.");
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage("❌ Erreur de connexion au serveur.");
      });

    // 🧼 Remettre la sidebar visible en cas de retour
    return () => {
      if (sidebar) sidebar.style.display = "";
    };
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <p
          className={`text-lg font-semibold mb-2 ${
            status === 'success'
              ? 'text-green-600'
              : status === 'alreadyUsed'
              ? 'text-yellow-600'
              : 'text-red-600'
          }`}
        >
          {message}
        </p>

        {(status === 'success' || status === 'alreadyUsed') && (
          <p className="text-sm text-gray-500">
            Redirection vers la page de connexion...
          </p>
        )}

        {status === 'error' && (
          <button
            onClick={() => window.location.href = "/?open=login"}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Retour à la connexion
          </button>
        )}

        <div className="mt-6 flex justify-center">
          <div className="text-4xl font-bold text-blue-600 animate-bounce">
            A
          </div>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;
