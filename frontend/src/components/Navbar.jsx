// src/components/Sidebar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Sidebar() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await fetch(`http://localhost:3001/api/utilisateur/${userId}`);
      const data = await res.json();
      setIsAdmin(data.utilisateur?.statut === "admin");
    };
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <div className="bg-white shadow h-screen w-60 fixed left-0 top-0 flex flex-col px-6 py-8">
      <div className="flex items-center space-x-2 mb-8">
        <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">A</div>
        <span className="text-lg font-semibold text-gray-800">Accessly</span>
      </div>

      <nav className="flex flex-col space-y-4 text-sm font-medium text-gray-700">
        <Link to="/dashboard" className="hover:text-blue-600">🏠 Dashboard</Link>
        <Link to="/profils" className="hover:text-blue-600">👥 Profils publics</Link>
        <Link to="/objets-connectes" className="hover:text-blue-600">🧠 Objets connectés</Link>
        {isAdmin && (
          <Link to="/valider-objets" className="hover:text-blue-600">✅ Objets à valider</Link>
        )}
        <button onClick={logout} className="text-red-600 hover:text-red-700 mt-6 text-left">🚪 Déconnexion</button>
      </nav>
    </div>
  );
}

export default Sidebar;
