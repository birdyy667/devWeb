import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Supprime l'identifiant
    navigate('/connexion'); // Redirige vers la page de connexion
  };

  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0' }}>
      <Link to="/inscription" style={{ marginRight: '1rem' }}>Inscription</Link>
      <Link to="/connexion" style={{ marginRight: '1rem' }}>Connexion</Link>
      <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
      <button onClick={handleLogout}>Déconnexion</button>
    </nav>
  );
}

export default Navbar;
