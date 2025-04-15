// src/pages/SuppressionSuccess.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Confirmation.css';

function SuppressionSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => navigate('/profils'), 3000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md text-center space-y-4">
        <p className="text-lg font-semibold text-blue-600">
          🗑️ Utilisateur supprimé avec succès !
        </p>
        <p className="text-sm text-gray-500">
          Redirection vers les profils publics...
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

export default SuppressionSuccess;
