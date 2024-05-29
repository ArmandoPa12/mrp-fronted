import React, { useState, useEffect,useContext  } from "react";
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


const Filas = () => {
    const { authData } = useContext(AuthContext);
    const { authToken, username,modulos, rol_id,user_id, } = authData;
    const permiso = (...ids) => ids.some(id => modulos.includes(id));

    
    let emptyUsuario = {
        id: null,
       codigo:'',
       descripcion:''
    };


const [filas, setFilas] = useState(null);

const [fila, setFila] = useState(emptyUsuario);
const [showCod, setShowCod] = useState(true);


const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);

const [productDialog, setProductDialog] = useState(false);
const [submitted, setSubmitted] = useState(false);



const fetchCharacter = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/filas"
      );
      setFilas(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching character:", error);
    }
  };
    useEffect(() => {
        fetchCharacter();
    }, []);


    const onInputChange = (e, name) => {
        const val = ((e.target && e.target.value) || '').toUpperCase();;
        let _product = { ...fila };

        _product[`${name}`] = val;
        // console.log(_product);
        setFila(_product);
    };

    const openNew = () => {
        setFila(emptyUsuario);
        setProductDialog(true);
        setShowCod(false);
    };
    // -------------------------
    const hideDialog = () => {
        setProductDialog(false);
    };
    const saveProduct =async () => {
        const cabeza = {
            headers: {
              Authorization: `46456`,
              Username: username,
              rol_id:rol_id,
              user_id:user_id
            }
          };
          
        setSubmitted(true);
        
        if (fila.descripcion.trim()) {

            if(fila.id){
                try {
                    await axios.put(`http://127.0.0.1:8000/api/filas/${fila.id}`,fila,cabeza);
                    setProductDialog(false);
                    setFila(emptyUsuario);
                    fetchCharacter();
                } catch (error) {
                    console.log(error);
                }
            }else{
                try {
                    const s = await axios.post(`http://127.0.0.1:8000/api/filas`,fila,cabeza);
                    console.log(s);

                    setProductDialog(false);
                    setFila(emptyUsuario);
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
        setFila(obj);
        setShowCod(true);
        setProductDialog(true);
    };

    // --------------------------------------------------
    const confirmDeleteProduct = (obj) => {
        console.log(obj);
        setFila(obj);
        setDeleteProductsDialog(true);
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {permiso(15)?(
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />

                ):(<></>)}
                {permiso(16)?(
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />

                ):(<></>)}
            </React.Fragment>
        );
    };
    
    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
      };
      const deleteProduct = async () => {
        const cabeza = {
            headers: {
              Authorization: `46456`,
              Username: username,
              rol_id:rol_id,
              user_id:user_id
            }
          };
        try {
            await axios.delete(`http://127.0.0.1:8000/api/filas/${fila.id}`,cabeza);
            fetchCharacter();
            setDeleteProductsDialog(false);
            setFila(emptyUsuario);
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
     

   
return (<>
        <Layout/>
        {permiso(13)?(
            <>
            <div style={{ width: '100%', height: '20px', visibility: 'hidden' }}></div>
            <div className="card">
            {permiso(14)?(
            <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />

            ):(<></>)}

                <DataTable value={filas} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="codigo" header="Codigo"></Column>
                    <Column field="descripcion" header="Descripcion"></Column>
                    {/* <Column field="nro_almacen" header="Nro. almacen"></Column> */}
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>
    
    
    
    
    
    
    
                <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                    
                    <div className="field">
                        <label htmlFor="name" className="font-bold">
                        Codigo
                        </label>
                        <InputText disabled={showCod} id="descripcion" value={fila.codigo} onChange={(e) => onInputChange(e, 'codigo')} required autoFocus className={classNames({ 'p-invalid': submitted && !fila.codigo })} />
                        {submitted && !fila.codigo && <small className="p-error">Name is required.</small>}
                    </div>
    
                    <div className="field">
                        <label htmlFor="name" className="font-bold">
                        Descripcion
                        </label>
                        <InputText id="descripcion" value={fila.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} required autoFocus className={classNames({ 'p-invalid': submitted && !fila.descripcion })} />
                        {submitted && !fila.descripcion && <small className="p-error">Name is required.</small>}
                    </div>
    
                    {/* <div className="field">
                        <label htmlFor="name" className="font-bold">
                        Nro. almacen
                        </label>
                        <InputText id="descripcion" value={almacen.nro_almacen} onChange={(e) => onInputChange(e, 'nro_almacen')} required autoFocus className={classNames({ 'p-invalid': submitted && !almacen.nro_almacen })} />
                        {submitted && !almacen.nro_almacen && <small className="p-error">Name is required.</small>}
                    </div> */}
                    
    
                    
                </Dialog>
    
    
                <Dialog visible={deleteProductsDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Eliminar"  modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}
                >
                    <div className="confirmation-content">
                    <i
                        className="pi pi-exclamation-triangle mr-3"
                        style={{ fontSize: "2rem" }}
                    />
                    {fila && (
                        <span>
                        Seguro que quieres eliminar este fila? <b>{fila.codigo}</b>?
                        </span>
                    )}
                    </div>
                </Dialog>
                </>
        ):(<>No tiene permisos para ver esta pagina</>)}
</>);
    
   
};
  
export default Filas;