import logo from './logo.svg';
import './App.css';
import { BrowserRouter,
  Routes,
  Route,
  Switch,
  Navigate ,
  Link } from 'react-router-dom';


import Layout from './pages/layout';
import Prueba from './pages/prueba';
import Roles from './pages/rolesPage';
import Login from './pages/login';
import { PrimeReactProvider } from 'primereact/api';

import { AuthProvider } from './context/authContext';
import Usuario from './pages/usuario';
import Almacenes from './pages/almacenesPage';
import Filas from './pages/filasPage';
import Estante from './pages/estantesPage';
import MateriaPrima from './pages/materiaPrimaPage';
import Modelos from './pages/modeloPage';
import Producto from './pages/productoPage';
import Inventario from './pages/inventarioPage';
import ProtectedRoute from './pages/protected';
import Logout from './pages/logoutPage';


function App() {
  return (
    <AuthProvider>  
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route index path="login" element={<Login />} />
            <Route path="prueba" element={<Prueba />} />
            <Route path="roles" element={<ProtectedRoute><Roles /></ProtectedRoute>}/>
            <Route path="sucursal" element={<ProtectedRoute> <Almacenes /></ProtectedRoute> } />
            <Route path="filas" element={<ProtectedRoute><Filas /></ProtectedRoute>} />
            <Route path="estantes" element={<ProtectedRoute><Estante /></ProtectedRoute>} />
            <Route path="inventario" element={<ProtectedRoute><Inventario /></ProtectedRoute>}/>
            <Route path="tipo-articulos" element={<ProtectedRoute><Modelos /></ProtectedRoute>} />
            <Route path="articulos" element={<ProtectedRoute><Producto/></ProtectedRoute>} />
            <Route path="materia-prima" element={<ProtectedRoute><MateriaPrima /></ProtectedRoute>} />
            <Route path="usuarios" element={<ProtectedRoute><Usuario /></ProtectedRoute>} />
            <Route path="logout" element={
              <Logout/>
            } />
          
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

const Home = () => {
  return <h1>Home</h1>;
};

export default App;
