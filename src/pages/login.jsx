import React, { useState,useContext ,useEffect} from 'react';
import axios from 'axios';
import { redirect } from 'react-router';
import { useNavigate  } from "react-router-dom";

import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { AuthContext } from '../context/authContext';

import { Panel } from 'primereact/panel';
import '../public/images/icon/mypanel.css';

function LoginForm() {

  let emptyUsuario = {
    id: null,
   codigo:'',
   nro_almacen:'',
   descripcion:''
};

  const [isLoggedIn, setLoggedIn] = useState(false);

  const { saveAuthData } = useContext(AuthContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();

const [almacen, setAlmacen] = useState(emptyUsuario);
const [submitted, setSubmitted] = useState(false);
const [value, setValue] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(username);
      console.log(password);
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        username: username,
        password: password
      });
      console.log('Respuesta de la API:', response.data);
      saveAuthData(response.data);
      navigate('/roles');
    } catch (error) {
      setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
      console.error('Error en la solicitud:', error);
    }
  };

   if (isLoggedIn) {
    console.log(true);
    // return <Redirect to="/ruta" />; // Redirecciona a la ruta '/ruta' cuando isLoggedIn sea true
    // return (<Navigate to="/roles" replace={true} />);
  }

  
  return(<>
   <div className="container">
      <Panel header="Login" className="panel">
      <form onSubmit={handleSubmit}>
        <p className="panel-text">
          <div className='abajo'>
          <div className="card flex justify-content-center">
            <FloatLabel>
                <InputText id="username"  value={username}   onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="username">Username</label>
            </FloatLabel>
            <br></br>
            <FloatLabel>
                <InputText id="password"  type='password' value={password}  onChange={(e) => setPassword(e.target.value)}  />
                <label htmlFor="password"   >Password</label>
            </FloatLabel>
        </div>
        <br></br>
        <br></br>
        <br></br>
        {error && <p>{error}</p>}
        <div className='derecha p-5' >
        <Button label="Iniciar sesión"  severity="success" onClick={handleSubmit} />
            {/* <button type="submit">Iniciar sesión</button> */}
            
        </div>
          </div>
        
        </p>
        </form>
      </Panel>
    </div>
  
  </>);

  
  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  // const [error, setError] = useState('');
  // const navigate = useNavigate();
  // const [isLoggedIn, setLoggedIn] = useState(false);

  // const { saveAuthData } = useContext(AuthContext);
  
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post('http://127.0.0.1:8000/api/login', {
  //       username: username,
  //       password: password
  //     });
  //     console.log('Respuesta de la API:', response.data);
  //     saveAuthData(response.data);
  //     navigate('/roles');
  //   } catch (error) {
  //     setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
  //     console.error('Error en la solicitud:', error);
  //   }
  // };

  // if (isLoggedIn) {
  //   console.log(true);
  //   // return <Redirect to="/ruta" />; // Redirecciona a la ruta '/ruta' cuando isLoggedIn sea true
  //   // return (<Navigate to="/roles" replace={true} />);
  // }

  // return (
  //   <div>
  //     <h2>Iniciar sesión</h2>
  //     <form onSubmit={handleSubmit}>
  //       <div>
  //         <label htmlFor="username">Usuario:</label>
  //         <input
  //           type="text"
  //           id="username"
  //           value={username}
  //           onChange={(e) => setUsername(e.target.value)}
  //         />
  //       </div>
  //       <div>
  //         <label htmlFor="password">Contraseña:</label>
  //         <input
  //           type="password"
  //           id="password"
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //         />
  //       </div>
  //       <button type="submit">Iniciar sesión</button>
  //     </form>
  //     {error && <p>{error}</p>}
  //   </div>
  // );

} 

export default LoginForm;
