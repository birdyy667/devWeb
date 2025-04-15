import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';
import Confirmation from './pages/Confirmation';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ResetSuccess from './pages/ResetSuccess';
import Profils from './pages/Profils';
import SuppressionSuccess from './pages/SuppressionSuccess';
import ObjetsConnectes from './pages/ObjetsConnectes'; 
import ValiderObjets from './pages/ValiderObjets'; 
import LandingPage from "./pages/LandingPage";
import Rapport from './pages/Rapport';


import PrivateRoute from './components/PrivateRoute';
import PrivateLayout from './layouts/PrivateLayout';

function AppWrapper() {
  const location = useLocation();
  const hideLayout = ["/", "/connexion", "/inscription"].includes(location.pathname);

  return (
    <>
      <Routes>
        {/* Routes publiques (sans sidebar) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/reset-success" element={<ResetSuccess />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
        <Route path="/inscription" element={<Register />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/confirmation/:token" element={<Confirmation />} />
        <Route path="/suppression-success" element={<SuppressionSuccess />} />

        {/* Routes privées (avec sidebar via PrivateLayout) */}
        <Route
          path="/dashboard"
          element={<PrivateRoute><PrivateLayout><Dashboard /></PrivateLayout></PrivateRoute>}
        />
        <Route
          path="/profils"
          element={<PrivateRoute><PrivateLayout><Profils /></PrivateLayout></PrivateRoute>}
        />
        <Route
          path="/objets-connectes"
          element={<PrivateRoute><PrivateLayout><ObjetsConnectes /></PrivateLayout></PrivateRoute>}
        />
        <Route
          path="/valider-objets"
          element={<PrivateRoute><PrivateLayout><ValiderObjets /></PrivateLayout></PrivateRoute>}
        />
        <Route
          path="/rapport"
          element={<PrivateRoute><PrivateLayout><Rapport /></PrivateLayout></PrivateRoute>}
        />  
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
