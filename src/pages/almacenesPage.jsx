import React, { useState, useEffect,useContext } from "react";
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



const Almacenes = () => {
    const { authData } = useContext(AuthContext);
    const { authToken, modulos,username, rol_id,user_id, } = authData;
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
       codigo:'',
       nro_almacen:'',
       descripcion:''
    };


const [almacenes, setAlmacenes] = useState(null);

const [almacen, setAlmacen] = useState(emptyUsuario);
const [showCod, setShowCod] = useState(true);


const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);

const [productDialog, setProductDialog] = useState(false);
const [submitted, setSubmitted] = useState(false);



const fetchCharacter = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/almacenes"
      );
      setAlmacenes(response.data.almacenes);
    } catch (error) {
      console.error("Error fetching character:", error);
    }
  };
    useEffect(() => {
        fetchCharacter();
    }, []);


    const onInputChange = (e, name) => {
        const val = ((e.target && e.target.value) || '').toUpperCase();;
        let _product = { ...almacen };

        _product[`${name}`] = val;
        // console.log(_product);
        setAlmacen(_product);
    };

    const openNew = () => {
        setAlmacen(emptyUsuario);
        setProductDialog(true);
        setShowCod(false);
    };
    // -------------------------
    const hideDialog = () => {
        setProductDialog(false);
    };
    const saveProduct =async () => {

        setSubmitted(true);
        
        if (almacen.descripcion.trim()) {

            if(almacen.id){
                try {
                    await axios.put(`http://127.0.0.1:8000/api/almacenes/${almacen.id}`,almacen,cabeza);
                    setProductDialog(false);
                    setAlmacen(emptyUsuario);
                    fetchCharacter();
                } catch (error) {
                    console.log(error);
                }
            }else{
                try {
                    await axios.post(`http://127.0.0.1:8000/api/almacenes`,almacen,cabeza);
                    setProductDialog(false);
                    setAlmacen(emptyUsuario);
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
    const editProduct = (obj) => {
        setAlmacen(obj);
        setShowCod(true);
        setProductDialog(true);
    };

    // --------------------------------------------------
    const confirmDeleteProduct = (obj) => {
        console.log(obj);
        setAlmacen(obj);
        setDeleteProductsDialog(true);
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {permiso(11)?(
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />

                ):(<></>)}

                {permiso(12)?(
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
            await axios.delete(`http://127.0.0.1:8000/api/almacenes/${almacen.id}`,cabeza);
            fetchCharacter();
            setDeleteProductsDialog(false);
            setAlmacen(emptyUsuario);
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

        {permiso(9)?(
            <>
            <div style={{ width: '100%', height: '20px', visibility: 'hidden' }}></div>
            <div className="card">
                {permiso(10)?(
            <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />

                ):(<></>)}
                <DataTable value={almacenes} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="codigo" header="Codigo"></Column>
                    <Column field="descripcion" header="Descripcion"></Column>
                    <Column field="nro_almacen" header="Nro. almacen"></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>
    
    
    
    
    
    
    
                <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                    
                    <div className="field">
                        <label htmlFor="name" className="font-bold">
                        Codigo
                        </label>
                        <InputText disabled={showCod} id="descripcion" value={almacen.codigo} onChange={(e) => onInputChange(e, 'codigo')} required autoFocus className={classNames({ 'p-invalid': submitted && !almacen.codigo })} />
                        {submitted && !almacen.codigo && <small className="p-error">Name is required.</small>}
                    </div>
    
                    <div className="field">
                        <label htmlFor="name" className="font-bold">
                        Descripcion
                        </label>
                        <InputText id="descripcion" value={almacen.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} required autoFocus className={classNames({ 'p-invalid': submitted && !almacen.descripcion })} />
                        {submitted && !almacen.descripcion && <small className="p-error">Name is required.</small>}
                    </div>
    
                    <div className="field">
                        <label htmlFor="name" className="font-bold">
                        Nro. almacen
                        </label>
                        <InputText id="descripcion" value={almacen.nro_almacen} onChange={(e) => onInputChange(e, 'nro_almacen')} required autoFocus className={classNames({ 'p-invalid': submitted && !almacen.nro_almacen })} />
                        {submitted && !almacen.nro_almacen && <small className="p-error">Name is required.</small>}
                    </div>
                    
    
                    
                </Dialog>
    
    
                <Dialog visible={deleteProductsDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Eliminar"  modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}
                >
                    <div className="confirmation-content">
                    <i
                        className="pi pi-exclamation-triangle mr-3"
                        style={{ fontSize: "2rem" }}
                    />
                    {almacen && (
                        <span>
                        Seguro que quieres eliminar este almacen? <b>{almacen.codigo}</b>?
                        </span>
                    )}
                    </div>
                </Dialog>
    
                </>
        ):(<>No tiene permisos para ver esta pagina</>)}
        
</>);
    
   
};
  
export default Almacenes;