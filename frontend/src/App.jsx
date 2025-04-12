import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import React, { useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar'; 
import PrivateRoute from './components/PrivateRoute';
import AjoutObjets from './components/AjoutObjets';
import ListeObjets from './components/ListeObjets';
import Confirmation from './pages/Confirmation';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ResetSuccess from './pages/ResetSuccess';
import GestionObjets from './pages/GestionObjets';
import Recherche from './pages/Recherche';
import Objet from './pages/Objet';



function App() {

  const [objects, setObjects] = useState([]);
  return (


    <BrowserRouter>
      <Navbar />

      <Routes>
          <Route path="/" element={<Navigate to="/connexion" />} />


      <Route path="/reset-success" element={<ResetSuccess />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />      
      <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />                                                                                                                                                                                             
      <Route path="/recherche" element={<Recherche />} />                                                                                                                                                                                                      
      <Route path="/objet" element={<Objet />} />                                                                                                                                                                                          
        <Route path="/inscription" element={<Register />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/confirmation/:token" element={<Confirmation />} />
        <Route
          path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        {/* Nouvelle route pour la gestion des objets */}
        <Route path="/gestion-objets"element={<GestionObjets /> } />

      </Routes>
    </BrowserRouter>
  );
}


export default App;

