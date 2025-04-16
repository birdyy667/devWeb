import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('userId');

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/connexion');
  };

  return (
    <nav className="bg-white shadow-md py-3 px-6 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center mr-2">
          <span className="text-white font-bold text-md">A</span>
        </div>
        <span className="text-xl font-semibold text-gray-700">Accessly</span>
      </Link>

      {/* Liens */}
      <div className="space-x-4 text-sm font-medium">

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 ml-2"
          >
            Déconnexion
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
