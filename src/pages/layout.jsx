import { Outlet, Link } from "react-router-dom";
import "primereact/resources/themes/lara-light-indigo/theme.css";

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/prueba">Prueba</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;