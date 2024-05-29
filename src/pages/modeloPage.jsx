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
import { Toast } from 'primereact/toast';

import { AuthContext } from '../context/authContext';


const Modelos = () => {
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

    const direccion = 'modelos';
    let emptyModelo = {
        id: null,
       codigo:'',
       descripcion:''
    };


const [modelos, setMaterias] = useState(null);

const [modelo, setModelo] = useState(emptyModelo);
const [showCod, setShowCod] = useState(true);


const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);

const [productDialog, setProductDialog] = useState(false);
const [submitted, setSubmitted] = useState(false);

const toast = useRef(null);




const fetchCharacter = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/${direccion}`
      );
      setMaterias(response.data.modelos);
      console.log(response.data.modelos);
    } catch (error) {
      console.error("Error fetching character:", error);
    }
  };
    useEffect(() => {
        fetchCharacter();
    }, []);


    const onInputChange = (e, name) => {
        const val = ((e.target && e.target.value) || '').toUpperCase();;
        let _product = { ...modelo };

        _product[`${name}`] = val;
        // console.log(_product);
        setModelo(_product);
    };
    const onInputNumberChange = (e, name) => {
        
        const val = e.value || 0;
        let _product = { ...modelo };
        _product[`${name}`] = val;
    
        setModelo(_product);
      };

    const openNew = () => {
        setModelo(emptyModelo);
        setProductDialog(true);
        setShowCod(false);
    };
    // -------------------------
    const hideDialog = () => {
        setProductDialog(false);
    };
    const saveProduct =async () => {

        setSubmitted(true);
        console.log(modelo);
        
        if (modelo.descripcion.trim()) {

            if(modelo.id){
                try {
                    const res = await axios.put(`http://127.0.0.1:8000/api/${direccion}/${modelo.id}`,modelo,cabeza);
                    setProductDialog(false);
                    showSuccess('Modelo actualizado exitosamente');
                    setModelo(emptyModelo);
                    console.log(res);
                    fetchCharacter();
                } catch (error) {
                    console.log(error);
                    showError();
                }
            }else{
                try {
                    const res = await axios.post(`http://127.0.0.1:8000/api/${direccion}`,modelo,cabeza);
                    setProductDialog(false);
                    showSuccess('Modelo creado exitosamente');
                    console.log(res);
                    setModelo(emptyModelo);
                    fetchCharacter();
                } catch (error) {
                    console.log(error);
                    showError();
                }
            }
            

          }
    };

    const showSuccess = (x) => {
        toast.current?.show({severity:'success', summary: 'Exitoso', detail:x, life: 3000});
    }
    const showError = () => {
        toast.current.show({severity:'error', summary: 'Error', detail:'Hubo un error', life: 3000});
    }



    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );


    // --------------------------------------------
    const editProduct = (obj) => {
        setModelo(obj);
        setShowCod(true);
        setProductDialog(true);
    };

    // --------------------------------------------------
    const confirmDeleteProduct = (obj) => {
        console.log(obj);
        setModelo(obj);
        setDeleteProductsDialog(true);
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {permiso(23)?(
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />

                ):(<></>)}
                {permiso(24)?(
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
            await axios.delete(`http://127.0.0.1:8000/api/${direccion}/${modelo.id}`,cabeza);
            fetchCharacter();
            showSuccess('Modelo eliminado exitosamente');
            setDeleteProductsDialog(false);
            setModelo(emptyModelo);
        } catch (error) {
            console.log(error);
            showError();

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
     

   
return (<>
        <Layout/>

        {permiso(21)?(
            <>
            <Toast ref={toast} />
            <div style={{ width: '100%', height: '20px', visibility: 'hidden' }}></div>
            <div className="card">
            {permiso(22)?(
            <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />

            ):(<></>)}
                <DataTable value={modelos} tableStyle={{ minWidth: '50rem' }}>
                    {/* <Column field="codigo" header="Codigo"></Column> */}
                    <Column field="descripcion" header="Descripcion"></Column>
                    {/* <Column field="compra" header="Compra"></Column> */}
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>
    
    
    
    
    
    
    
                <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                    
                    {/* <div className="field">
                        <label htmlFor="name" className="font-bold">
                        Codigo
                        </label>
                        <InputText id="descripcion" value={modelo.codigo} onChange={(e) => onInputChange(e, 'codigo')} required autoFocus className={classNames({ 'p-invalid': submitted && !modelo.codigo })} />
                        {submitted && !modelo.codigo && <small className="p-error">Name is required.</small>}
                    </div> */}
    
                    <div className="field">
                        <label htmlFor="name" className="font-bold">
                        Descripcion
                        </label>
                        <InputText id="descripcion" value={modelo.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} required autoFocus className={classNames({ 'p-invalid': submitted && !modelo.descripcion })} />
                        {submitted && !modelo.descripcion && <small className="p-error">descripcion is required.</small>}
                    </div>
    
                    {/* <div className="field">
                    <label htmlFor="compra" className="font-bold">
                        Precio
                    </label>  
                        <InputNumber inputId="currency-us" value={modelo.compra} onChange={(e) => onInputNumberChange(e,"compra")} mode="currency" currency="USD" locale="en-US" />
                        {submitted && !modelo.compra && ( <small className="p-error">es requerido.</small>)}
                    </div> */}
                    
                   
                </Dialog>
    
    
                <Dialog visible={deleteProductsDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Eliminar"  modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}
                >
                    <div className="confirmation-content">
                    <i
                        className="pi pi-exclamation-triangle mr-3"
                        style={{ fontSize: "2rem" }}
                    />
                    {modelo && (
                        <span>
                        Seguro que quieres eliminar este modelo? <b>{modelo.codigo}</b>?
                        </span>
                    )}
                    </div>
                </Dialog>
                </>
        ):(<>No tiene permisos para ver esta pagina</>)}
</>);
    
   
};
  
export default Modelos;