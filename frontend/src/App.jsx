import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar'; 
import PrivateRoute from './components/PrivateRoute';
import Confirmation from './pages/Confirmation';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ResetSuccess from './pages/ResetSuccess';



function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
      <Route path="/reset-success" element={<ResetSuccess />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />      
      <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />                                                                                                                                                                                             
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
      </Routes>
    </BrowserRouter>
  );
}


export default App;

