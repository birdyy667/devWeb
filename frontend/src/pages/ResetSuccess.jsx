import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Confirmation.css'; // Utilise la classe .animate-wiggle

function ResetSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => navigate('/connexion'), 4000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md text-center space-y-4">
        <p className="text-lg font-semibold text-green-600">
          🎉 Ton mot de passe a été réinitialisé avec succès !
        </p>
        <p className="text-sm text-gray-500">
          Redirection vers la page de connexion dans quelques secondes...
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
