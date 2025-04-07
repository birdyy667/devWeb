import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const isLoggedIn = localStorage.getItem('userId'); // vérifie si connecté

  if (!isLoggedIn) {
    return <Navigate to="/connexion" replace />; // redirige vers /connexion
  }

  return children;
}

export default PrivateRoute;



