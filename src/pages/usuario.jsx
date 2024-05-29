import React, { useState, useEffect ,useContext} from "react";
import axios from "axios";
import 'primeicons/primeicons.css';
import 'tailwindcss/tailwind.css';
import Layout from "./layout";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { RadioButton } from "primereact/radiobutton";
import { Calendar } from 'primereact/calendar';
import { AuthContext } from '../context/authContext';


const Usuario = () => {

    const { authData } = useContext(AuthContext);
const { modulos, username, rol_id,user_id, } = authData;

const permiso = (...ids) => ids.some(id => modulos.includes(id));

const cabeza = {
            headers: {
              Authorization: `46456`,
              Username: username,
              rol_id:rol_id,
              user_id:user_id
            }
          };

    let emptyUsuario = {
        id: null,
        nombre:'',
        apellido_p:'',
        apellido_m:'',
        ci:'',
        nacimiento:'',
        correo:'',
        username:'',
        password:'',
        rol_id: '',

    };


const [usuarios, setUsuarios] = useState(null);
const [rol, setRol] = useState(emptyUsuario);
const [rols, setRols] = useState(null);
const [rolSelect, setRolselect] = useState(null);

const [date, setDate] = useState(null);
const [dateReal, setDateReal] = useState(null);
const [showPass, setshowPass] = useState(false);

const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);

const [productDialog, setProductDialog] = useState(false);
const [submitted, setSubmitted] = useState(false);
// const [modulos, setModulos] = useState(null);
// const [modulo, setModulo] = useState([]);
// const [selectedCities, setSelectedCities] = useState([]);
// const [id, setId] = useState([]);


const fetchCharacter = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/usuarios"
      );
     
      const adaptedData = response.data.data.map(usuario => ({
          id: usuario.id,
          correo: usuario.correo || '',
          username: usuario.username || '',
          rol_id: usuario.rol_id || null,
          rol_nombre: usuario.roles ? usuario.roles.nombre || '' : '',
          nombre: usuario.personas.nombre,
          paterno: usuario.personas.apellido_p,
          materno: usuario.personas.apellido_m,
          ci: usuario.personas.ci,
          nacimiento: usuario.personas.nacimiento,
      }));

      setUsuarios(adaptedData);
      console.log(adaptedData);

    } catch (error) {
      console.error("Error fetching character:", error);
    }
  };
    useEffect(() => {
        fetchCharacter();
    }, []);

    const getModulos = async (id) => {   
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/roles`);
            const datos = response.data.data.map(modulo => ({
                            key: modulo.id,
                            name: modulo.nombre,
            }));

            setRols(datos);
            console.log(datos);
        } catch (error) {
            console.log(error);
        }
    };


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...rol };

        _product[`${name}`] = val;
        console.log(_product);
        setRol(_product);
    };

    const openNew = () => {
        getModulos();
        setRolselect({key:1,name:'admin'});
        setRol(emptyUsuario);
        setDate(null);
        setSubmitted(false);
        setProductDialog(true);
        setshowPass(true);
    };
    // -------------------------
    const hideDialog = () => {
        setProductDialog(false);
        setshowPass(false);
        setRols(null);
    };
    const saveProduct =async () => {
        let _product = { ...rol };
        _product[`rol_id`] = rolSelect.key;
        _product[`nacimiento`] = dateReal;
        setRol(_product);


        setSubmitted(true);
        
        if (rol.nombre.trim()) {
            if(rol.id ){
                try {
                    await axios.post(`http://127.0.0.1:8000/api/usuarios/${rol.id}`,rol,cabeza);
                    setProductDialog(false);
                    setRol(emptyUsuario);
                    fetchCharacter();
                } catch (error) {
                    console.log(error);
                }
            }else{
                try {
                    await axios.post(`http://127.0.0.1:8000/api/usuarios`,rol,cabeza);
                    setProductDialog(false);
                    setRol(emptyUsuario);
                    fetchCharacter();
                } catch (error) {
                    console.log(error);
                }
            }
            

          }
    };
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );


    // --------------------------------------------
    const parseDate = (dateString) => {
        // Dividir la cadena de fecha en año, mes y día
        const [year, month, day] = dateString.split('-');
        // Crear un objeto Date con los componentes de la fecha
        return new Date(year, month - 1, day); // El mes en Date es 0-indexado, por lo que restamos 1
    };

    const seleccionar=(value)=>{
        console.log(value);
        setRolselect(value);
    }

    const selecionarFecha=(value)=>{
        const isoString = value.toISOString();
        const fecha = isoString.substring(0, 10);
        console.log(fecha);
        setDate(value);
        setDateReal(fecha);
    }
    const editProduct = (product) => {

        getModulos();
        setRolselect({key:product.rol_id,name:product.rol_nombre});
        setshowPass(false);
        setRol({ ...product });
        setDate(parseDate(product.nacimiento));
        setProductDialog(true);
    };

    // --------------------------------------------------
    const confirmDeleteProduct = (user) => {
        console.log(user);
        setRol(user);
        setDeleteProductsDialog(true);
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {permiso(3)?(
                    <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                ):(<></>)}
                {permiso(4)?(
                    <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
                ):(<></>)}
                
            </React.Fragment>
        );
    };
    
    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
      };
      const deleteProduct = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/usuarios/${rol.id}`,cabeza);
            fetchCharacter();
            setDeleteProductsDialog(false);
            setRol(emptyUsuario);
        } catch (error) {
            console.log(error);
        }

      };

    const deleteProductsDialogFooter = (
        <React.Fragment>
          <Button
            label="No"
            icon="pi pi-times"
            outlined
            onClick={hideDeleteProductsDialog}
          />
          <Button
            label="Si"
            icon="pi pi-check"
            severity="danger"
            onClick={deleteProduct}
          />
        </React.Fragment>
      );
     

   
return (
    <>
        <Layout/>

    {permiso(1)?(
        <>
        <div style={{ width: '100%', height: '20px', visibility: 'hidden' }}></div>
        <div className="card">
        {permiso(2)?(
        <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
        ):(<></>)}
            <DataTable value={usuarios} tableStyle={{ minWidth: '50rem' }}>
                <Column field="id" header="ID"></Column>
                <Column field="correo" header="Email"></Column>
                <Column field="username" header="User"></Column>
                <Column field="rol_nombre" header="Rol"></Column>
                <Column field="nombre" header="Nombre"></Column>
                <Column field="paterno" header="Paterno"></Column>
                <Column field="materno" header="Materno"></Column>
                <Column field="ci" header="C.I."></Column>
                <Column field="nacimiento" header="Fecha nacimiento"></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>
        </div>







            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nombre
                    </label>
                    <InputText id="nombre" value={rol.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !rol.nombre })} />
                    
                </div>
                
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Apellido paterno
                    </label>
                    <InputText id="paterno" value={rol.paterno} onChange={(e) => onInputChange(e, 'apellido_p')} required autoFocus className={classNames({ 'p-invalid': submitted && !rol.paterno })} />
                    
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Apellido materno
                    </label>
                    <InputText id="materno" value={rol.materno} onChange={(e) => onInputChange(e, 'apellido_m')} required autoFocus className={classNames({ 'p-invalid': submitted && !rol.materno })} />
                    
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        C.I.
                    </label>
                    <InputText id="ci" value={rol.ci} onChange={(e) => onInputChange(e, 'ci')} required autoFocus className={classNames({ 'p-invalid': submitted && !rol.ci })} />
                    
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Fecha nacimiento
                    </label>
                    <div className="card flex justify-content-center">
                        <Calendar value={date} onChange={(e) => selecionarFecha(e.value)} />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        email
                    </label>
                    <InputText id="correo" value={rol.correo} onChange={(e) => onInputChange(e, 'correo')} required autoFocus className={classNames({ 'p-invalid': submitted && !rol.correo })} />
                    {submitted && !rol.correo && <small className="p-error">descripcion is required.</small>}
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nombre de usuario
                    </label>
                    <InputText id="username" value={rol.username} onChange={(e) => onInputChange(e, 'username')} required autoFocus className={classNames({ 'p-invalid': submitted && !rol.username })} />
                    {submitted && !rol.username && <small className="p-error">descripcion is required.</small>}
                </div>
                
                {showPass?(
                    <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Contraseña
                    </label>
                    <InputText id="password" value={rol.password} onChange={(e) => onInputChange(e, 'password')} required autoFocus className={classNames({ 'p-invalid': submitted && !rol.password })} />
                    {submitted && !rol.password && <small className="p-error">descripcion is required.</small>}
                </div>
                ):(
                    <></>
                )}
                

                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        privilegios
                    </label>

                    {rols?(
                            <div className="flex flex-column gap-3">
                            {rols.map((category) => {
                                return (
                                    <div key={category.key} className="flex align-items-center">
                                        <RadioButton inputId={category.key} name="category" value={category} onChange={(e) => seleccionar(e.value)} checked={rolSelect.key === category.key} />
                                        <label htmlFor={category.key} className="ml-2">{category.name}</label>
                                    </div>
                                );
                            })}
                        </div>
                    ):(<p>Cargando...</p>)}
                    
                </div>

                
            </Dialog>


            <Dialog visible={deleteProductsDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Eliminar"  modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}
            >
                <div className="confirmation-content">
                <i
                    className="pi pi-exclamation-triangle mr-3"
                    style={{ fontSize: "2rem" }}
                />
                {rol && (
                    <span>
                    Seguro que quieres eliminar al usuario <b>{rol.name}</b>?
                    </span>
                )}
                </div>
            </Dialog>
</>
    ):(<>no tienes acceso </>)}

    </>
);
    
   
};
  
export default Usuario;