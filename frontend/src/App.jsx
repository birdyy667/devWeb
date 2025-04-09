import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar'; 
import PrivateRoute from './components/PrivateRoute';
import Confirmation from './pages/Confirmation';

 

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>                                                                                                                                                                                                   
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

