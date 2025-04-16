import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React from 'react';

import Register from './pages/Register';
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';
import Confirmation from './pages/Confirmation';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ResetSuccess from './pages/ResetSuccess';
import SuppressionSuccess from './pages/SuppressionSuccess';

import Profils from './pages/Profils';
import ObjetsConnectes from './pages/ObjetsConnectes';
import ValiderObjets from './pages/ValiderObjets';
import Rapport from './pages/Rapport';
import LandingPage from './pages/LandingPage';
import GestionObjets from './pages/GestionObjets';

import PrivateRoute from './components/PrivateRoute';
import PrivateLayout from './layouts/PrivateLayout';
import HistoriqueConnexion from "./pages/HistoriqueConnexion";


function AppWrapper() {
  const location = useLocation();
  const hideLayout = ["/", "/connexion", "/inscription"].includes(location.pathname);

  return (
    <>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/reset-success" element={<ResetSuccess />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
        <Route path="/inscription" element={<Register />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/confirmation/:token" element={<Confirmation />} />
        <Route path="/suppression-success" element={<SuppressionSuccess />} />

        {/* Routes privées (avec sidebar) */}
        <Route path="/dashboard" element={<PrivateRoute><PrivateLayout><Dashboard /></PrivateLayout></PrivateRoute>} />
        <Route path="/profils" element={<PrivateRoute><PrivateLayout><Profils /></PrivateLayout></PrivateRoute>} />
        <Route path="/objets-connectes" element={<PrivateRoute><PrivateLayout><ObjetsConnectes /></PrivateLayout></PrivateRoute>} />
        <Route path="/valider-objets" element={<PrivateRoute><PrivateLayout><ValiderObjets /></PrivateLayout></PrivateRoute>} />
        <Route path="/rapport" element={<PrivateRoute><PrivateLayout><Rapport /></PrivateLayout></PrivateRoute>} />
        <Route path="/gestion-objets" element={<PrivateRoute><PrivateLayout><GestionObjets /></PrivateLayout></PrivateRoute>} />
        <Route path="/historique" element={<PrivateRoute><PrivateLayout><HistoriqueConnexion /></PrivateLayout></PrivateRoute>} />

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
