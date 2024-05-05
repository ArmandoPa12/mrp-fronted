import logo from './logo.svg';
import './App.css';
import { BrowserRouter,
  Routes,
  Route,
  Switch,
  Link } from 'react-router-dom';


import Layout from './pages/layout';
import Prueba from './pages/prueba';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="prueba" element={<Prueba />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const Home = () => {
  return <h1>Home</h1>;
};

export default App;
