import React, { useState, useEffect } from "react";
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
import { InputNumber } from "primereact/inputnumber";



const MateriaPrima = () => {

    const direccion = 'materias-primas';
    let emptyUsuario = {
        id: null,
       codigo:'',
       nombre:'',
       compra:''
    };


const [materias, setMaterias] = useState(null);

const [materia, setMateria] = useState(emptyUsuario);
const [showCod, setShowCod] = useState(true);


const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);

const [productDialog, setProductDialog] = useState(false);
const [submitted, setSubmitted] = useState(false);



const fetchCharacter = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/${direccion}`
      );
      setMaterias(response.data.materiaPrimas);
      console.log(response.data.materiaPrimas);
    } catch (error) {
      console.error("Error fetching character:", error);
    }
  };
    useEffect(() => {
        fetchCharacter();
    }, []);


    const onInputChange = (e, name) => {
        const val = ((e.target && e.target.value) || '').toUpperCase();;
        let _product = { ...materia };

        _product[`${name}`] = val;
        // console.log(_product);
        setMateria(_product);
    };
    const onInputNumberChange = (e, name) => {
        
        const val = e.value || 0;
        let _product = { ...materia };
        _product[`${name}`] = val;
    
        setMateria(_product);
      };

    const openNew = () => {
        setMateria(emptyUsuario);
        setProductDialog(true);
        setShowCod(false);
    };
    // -------------------------
    const hideDialog = () => {
        setProductDialog(false);
    };
    const saveProduct =async () => {

        setSubmitted(true);
        console.log(materia);
        
        if (materia.nombre.trim()) {

            if(materia.id){
                try {
                    const res = await axios.put(`http://127.0.0.1:8000/api/${direccion}/${materia.id}`,materia);
                    setProductDialog(false);
                    setMateria(emptyUsuario);
                    console.log(res);
                    fetchCharacter();
                } catch (error) {
                    console.log(error);
                }
            }else{
                try {
                    const res = await axios.post(`http://127.0.0.1:8000/api/${direccion}`,materia);
                    setProductDialog(false);
                    console.log(res);
                    setMateria(emptyUsuario);
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
        setMateria(obj);
        setShowCod(true);
        setProductDialog(true);
    };

    // --------------------------------------------------
    const confirmDeleteProduct = (obj) => {
        console.log(obj);
        setMateria(obj);
        setDeleteProductsDialog(true);
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };
    
    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
      };
      const deleteProduct = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/${direccion}/${materia.id}`);
            fetchCharacter();
            setDeleteProductsDialog(false);
            setMateria(emptyUsuario);
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
        <div style={{ width: '100%', height: '20px', visibility: 'hidden' }}></div>
        <div className="card">
        <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
            <DataTable value={materias} tableStyle={{ minWidth: '50rem' }}>
                <Column field="codigo" header="Codigo"></Column>
                <Column field="nombre" header="Material"></Column>
                <Column field="compra" header="Compra"></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>
        </div>







            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                    Codigo
                    </label>
                    <InputText disabled={showCod} id="descripcion" value={materia.codigo} onChange={(e) => onInputChange(e, 'codigo')} required autoFocus className={classNames({ 'p-invalid': submitted && !materia.codigo })} />
                    {submitted && !materia.codigo && <small className="p-error">Name is required.</small>}
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">
                    Nombre
                    </label>
                    <InputText id="nombre" value={materia.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !materia.nombre })} />
                    {submitted && !materia.nombre && <small className="p-error">Name is required.</small>}
                </div>

                <div className="field">
                <label htmlFor="compra" className="font-bold">
                    Precio
                </label>  
                    <InputNumber inputId="currency-us" value={materia.compra} onChange={(e) => onInputNumberChange(e,"compra")} mode="currency" currency="USD" locale="en-US" />
                    {submitted && !materia.compra && ( <small className="p-error">es requerido.</small>)}
                </div>
                
               
            </Dialog>


            <Dialog visible={deleteProductsDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Eliminar"  modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}
            >
                <div className="confirmation-content">
                <i
                    className="pi pi-exclamation-triangle mr-3"
                    style={{ fontSize: "2rem" }}
                />
                {materia && (
                    <span>
                    Seguro que quieres eliminar esta materia prima? <b>{materia.codigo}</b>?
                    </span>
                )}
                </div>
            </Dialog>
</>);
    
   
};
  
export default MateriaPrima;