import { Outlet, Link } from "react-router-dom";
import React, { useState, useRef,useContext } from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import { Menu } from "primereact/menu";

import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";

import { Toast } from "primereact/toast";
import { AuthContext } from '../context/authContext';

const Layout = () => {
  const { authData, logout } = useContext(AuthContext);
    const { modulos } = authData;
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);

  
  const isModuleIncluded = (...ids) => ids.some(id => modulos.includes(id));

  // const items = [
  //   {
  //     label: 'Dashboard',
  //     items: [
  //       {
  //         label: 'home',
  //         icon: 'pi pi-plus',
  //         to: '/', // Ruta a la que enlaza este elemento del menú
  //       },
  //       // {
  //       //   label: 'prueba',
  //       //   icon: 'pi pi-search',
  //       //   to: '/prueba', // Ruta a la que enlaza este elemento del menú
  //       // },
  //       {
  //         label: 'roles',
  //         icon: 'pi pi-search',
  //         to: '/roles', // Ruta a la que enlaza este elemento del menú
  //       },
        
  //     ],
  //   },
  //   {
  //     label: 'Materiales',
  //     items: [
  //       {
  //         label: 'Sucursal',
  //         icon: 'pi pi-cog',
  //         to: '/sucursal', // Ruta a la que enlaza este elemento del menú
  //       },
  //       {
  //         label: 'Filas',
  //         icon: 'pi pi-cog',
  //         to: '/filas', // Ruta a la que enlaza este elemento del menú
  //       },
  //       {
  //         label: 'Estantes',
  //         icon: 'pi pi-cog',
  //         to: '/estantes', // Ruta a la que enlaza este elemento del menú
  //       },
  //       {
  //         label: 'Materia prima',
  //         icon: 'pi pi-cog',
  //         to: '/materia-prima', // Ruta a la que enlaza este elemento del menú
  //       },
  //     ],
  //   },
  //   {
  //     label: 'Perfil',
  //     items: [
  //       {
  //         label: 'Usuarios',
  //         icon: 'pi pi-cog',
  //         to: '/usuarios', // Ruta a la que enlaza este elemento del menú
  //       },
  //       {
  //         label: 'Logout',
  //         icon: 'pi pi-sign-out',
  //         to: '/logout', // Ruta a la que enlaza este elemento del menú
  //       },
  //       {
  //         label: 'login',
  //         icon: 'pi pi-search',
  //         to: '/login', // Ruta a la que enlaza este elemento del menú
  //       },
  //     ],
  //   },
  // ];

  // return (

  //   <div className="card flex justify-content-center">
  //     <Sidebar visible={visible} onHide={() => setVisible(false)}>
  //       {/* <Toast ref={toast} /> */}
  //       <Menu model={items.map(group => ({...group,
  //         items: group.items.map(item => ({...item,
  //           command: () => setVisible(false),
  //           template: () => (
  //             <div className="text-center"> {/* Centro el contenido */}
  //              <Button  label={item.label} severity="secondary" text />
  //             </div>   
  //             // <Button label="Primary" text />          
  //             // <a href={item.to} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  //             //   {item.label}
  //             // </a>
  //           )
  //         })) 
  //       }))} />

  //     </Sidebar>
  //     <Button icon="pi pi-arrow-right" onClick={() => setVisible(true)} />
  //     <Outlet />
  //   </div>


  //   // <div className="card flex justify-content-center">
  //   //   <Sidebar visible={visible} onHide={() => setVisible(false)}>
  //   //     <Toast ref={toast} />
  //   //     <Menu model={items} />
  //   //   </Sidebar>
  //   //   <Button icon="pi pi-arrow-right" onClick={() => setVisible(true)} />
  //   //   <Outlet />
  //   // </div>
  // );

  const items = [ 
    {
        label: 'Dashborad',
        items: [
          {
              label: 'Home',
              icon: 'pi pi-plus',
              url: '/prueba'
          },
            {
              label: 'Roles',
              icon: 'pi pi-search',
              url: '/roles',
            },
            {
                label: 'Usuario',
                icon: 'pi pi-search',
                url: '/usuarios',
            }
        ]
    },
    {
      label: 'Ubicacion',
      items: [
          {
              label: 'Sucursal',
              icon: 'pi pi-cog',
              url: '/sucursal',
          },
          {
              label: 'Filas',
              icon: 'pi pi-sign-out',
              url: '/filas',
          },
          {
              label: 'Estante',
              icon: 'pi pi-sign-out',
              url: '/estantes',
          }
      ]
    },
    {
        label: 'Materiales',
        items: [
            {
              label: 'Tipo articulo',
              icon: 'pi pi-sign-out',
              url: '/tipo-articulos',
          },
          {
            label: 'Articulo',
            icon: 'pi pi-sign-out',
            url: '/articulos',
          },
          {
            label: 'Inventario',
            icon: 'pi pi-sign-out',
            url: '/inventario',
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            url: '/logout',
          }
        ]
    }
];

return (


<div className="card flex justify-content-center">
    
<Sidebar visible={visible} onHide={() => setVisible(false)}>
  <div id="menu" style={{ width: '100%' }}>
    <Toast ref={toast} />
    <Menu model={items} />
  </div>
</Sidebar>
<Button icon="pi pi-arrow-right" onClick={() => setVisible(true)} />
</div>
  
)


// return (
//   <div className="card flex justify-content-center">
//       <Toast ref={toast} />
//       <Menu model={items} />
//   </div>
// )

};

export default Layout;
