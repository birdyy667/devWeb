import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Confirmation.css'; // Pour l'animation wiggle

function ResetSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // On redirige vers la page d’accueil avec un query param pour forcer l’ouverture de la modale
    const timeout = setTimeout(() => navigate('/?open=login'), 4000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md text-center space-y-4">
        <p className="text-lg font-semibold text-green-600">
          🎉 Ton mot de passe a été réinitialisé avec succès !
        </p>
        <p className="text-sm text-gray-500">
          Redirection vers la connexion dans quelques secondes...
        </p>

        <div className="flex justify-center mt-4">
          <div className="animate-wiggle w-10 h-10 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center text-xl">
            A
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetSuccess;
