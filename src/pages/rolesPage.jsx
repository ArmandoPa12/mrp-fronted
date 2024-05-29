import React, { useState, useEffect, useRef,useContext } from "react";
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
import { MultiSelect } from 'primereact/multiselect';
import { PickList } from 'primereact/picklist';
import { Toast } from 'primereact/toast';
import { AuthContext } from '../context/authContext';

const Roles = () => {
    const { authData } = useContext(AuthContext);
const { authToken, username,modulos, rol_id,user_id, } = authData;
const permiso = (...ids) => ids.some(id => modulos.includes(id));


const cabeza = {
            headers: {
              Authorization: `46456`,
              Username: username,
              rol_id:rol_id,
              user_id:user_id
            }
          };

    let emptyRol = {
        id: null,
        nombre:'',
        descripcion:'',
        modulosP: []
    };


const [rols, setRols] = useState(null);
const [rol, setRol] = useState(emptyRol);
const [productDialog, setProductDialog] = useState(false);
const [editar, setEditar] = useState(false);
const [submitted, setSubmitted] = useState(false);
const [modulosP, setmodulosP] = useState(null);
const [modulo, setModulo] = useState([]);
const [selectedCities, setSelectedCities] = useState(null);
const [source, setSource] = useState([]);
const [target, setTarget] = useState([]);
const toast = useRef(null);



const fetchCharacter = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/roles"
      );
      // setCharacter(response.data.data);
      // console.log(response.data.data);
      const adaptedData = response.data.data.map(dato => ({
          id: dato.id,
          nombre: dato.nombre,
          descripcion: dato.descripcion,
          modulos: dato.rol_modulos.length
      }));

      setRols(adaptedData);
      // console.log(rols);

    } catch (error) {
      console.error("Error fetching character:", error);
    }
  };
    useEffect(() => {
        fetchCharacter();
      }, []);

    const rolData = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/roles/${id}`);
            const rolmodulosP = response.data.data[0].rol_modulos.map(modulo => ({
                code: modulo.id,
                name: modulo.nombre,
                // slag: modulo.slag
            }));
            // setModulo(rolmodulosP);
            setSelectedCities(rolmodulosP);

            // console.log(rolInfos);
        } catch (error) {
            console.error("Error fetching character:", error);
        }
    };


    const getmodulosP = async (id) => {   
        // const dataC = {
        //     nombre: "persona.d",
        //     slag: "persona.d"
        // };
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/modulos`);
            // const datos = response.data;
            const datos = response.data.data.map(modulo => ({
                code: modulo.id,
                name: modulo.nombre,
                            // slag: modulo.slag
            }));


            setmodulosP(datos);
            // console.log(datos);
        } catch (error) {
            console.log(error);
            // console.error("", error);
        }
    };


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...rol };
        console.log(val);
        _product[`${name}`] = val;

        setRol(_product);
    };

    const openNew = () => {
        setEditar(false);
        getmodulosP();
        setRol(emptyRol);
        setSubmitted(false);
        setProductDialog(true);
    };
    // -------------------------
    const hideDialog = () => {
        // setSubmitted(false);
        setProductDialog(false);
        setTarget(false);
        setModulo([]);
        setSelectedCities(null);
    };

    const saveProduct =async () => {

        const codigos = selectedCities?.map(item => item.code);
        rol['modulos'] = codigos;
        setSubmitted(true);
        console.log(rol);

        if (rol.nombre.trim()) {

            if(rol.id){
                try {
                    await axios.put(`http://127.0.0.1:8000/api/roles/${rol.id}`,rol,cabeza);
                    setProductDialog(false);
                    showSuccess('Rol actualizado exitosamente');
                    setRol(emptyRol);
                    fetchCharacter();
                    
                } catch (error) {
                    console.log(error);
                    showError();
                }   
            }else{
                try {
                    await axios.post(`http://127.0.0.1:8000/api/roles`,rol,cabeza);
                    setProductDialog(false);
                    showSuccess('Rol creado exitosamente');
                    setRol(emptyRol);                    
                    fetchCharacter();
                } catch (error) {
                    console.log(error);
                    showError();
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
    const showSuccess = (x) => {
        toast.current?.show({severity:'success', summary: 'Exitoso', detail:x, life: 3000});
    }
    const showError = () => {
        toast.current.show({severity:'error', summary: 'Error', detail:'Hubo un error', life: 3000});
    }

    // --------------------------------------------
    const editProduct = (product) => {
        // setModulo([]);
        setSelectedCities([]);
        setTarget([]);
        setEditar(true);

        rolData(product.id); //obtiene los permisos 
        getmodulosP();  //obtiene los roles


        setSelectedCities(modulo);
        setRol({ ...product });
        setProductDialog(true);
    };
    const confirmDeleteProduct = (product) => {
        // setProduct(product);
        // setDeleteProductDialog(true);
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {permiso(7)?(
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                ):(<></>)}

                {permiso(8)?(
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
                ):(<></>)}
            </React.Fragment>
        );
    };
    
    const onChangeSave = (event) => {
        setSelectedCities(event);
    };
    const onChangeEdit = (event) => {
        setSource(event.source);
        setModulo(event.modulo);
    };

    const itemTemplate = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold">{item.name}</span>
                </div>
            </div>
        );
    };

   
return (
    <>
    <Layout/>
    {permiso(5)?(
        <>
            

        <Toast ref={toast} />
        <div style={{ width: '100%', height: '20px', visibility: 'hidden' }}></div>
        <div className="card">

        
        {permiso(6)?(
            <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
        ):(<></>)}
            <DataTable value={rols} tableStyle={{ minWidth: '50rem' }}>
                <Column field="id" header="Code"></Column>
                <Column field="nombre" header="Name"></Column>
                <Column field="descripcion" header="Category"></Column>
                <Column field="modulos" header="Quantity"></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>
        </div>

            <Dialog header="Roles" visible={productDialog} maximizable style={{ width: '50vw' }}  footer={productDialogFooter} className="p-fluid" onHide={hideDialog}>

                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Name
                    </label>
                    <InputText id="name" value={rol.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !rol.nombre })} />
                    {submitted && !rol.nombre && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        descripcion
                    </label>
                    <InputText id="descripcion" value={rol.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} required autoFocus className={classNames({ 'p-invalid': submitted && !rol.nombre })} />
                    {submitted && !rol.descripcion && <small className="p-error">descripcion is required.</small>}
                </div>


                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        privilegios
                    </label>

                    {modulosP?(
                        <div className="card flex justify-content-center">
                        <MultiSelect value={selectedCities} onChange={(e) => onChangeSave(e.value)} options={modulosP} optionLabel="name" 
                                placeholder="Seleccionar privilegios" maxSelectedLabels={5} className="w-full md:w-20rem" />
                        </div>
                    ):(
                        <p>Cargando...</p>
                    )}
                    
                </div>



               
            </Dialog>
    </>
    ):(<>No tiene permisos para ver la pagina</>)}
    
    </>
    );
    
   
};
  
export default Roles;