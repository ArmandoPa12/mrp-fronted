import React, { useState, useEffect,useContext } from "react";
import axios from "axios";
import 'primeicons/primeicons.css';
import 'tailwindcss/tailwind.css';
import Layout from "./layout";

import { TabView, TabPanel } from 'primereact/tabview';
import { Tag } from 'primereact/tag';
        

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { RadioButton } from "primereact/radiobutton";
import { Calendar } from 'primereact/calendar';
import { AuthContext } from '../context/authContext';


const Inventario = () => {

    const { authData } = useContext(AuthContext);
    const { authToken, username,modulos, rol_id,user_id, } = authData;
    const permiso = (...ids) => ids.some(id => modulos.includes(id));

    let emptyUsuario = {
        id: null,
       codigo:'',
       nro_almacen:'',
       descripcion:''
    };


const [almacenes, setAlmacenes] = useState(null);

const [materiaPrima,setMateriaPrima] = useState(null);
const [material,setMaterial] = useState(null);

const [searchText, setSearchText] = useState('');


const [almacen, setAlmacen] = useState(emptyUsuario);
const [showCod, setShowCod] = useState(true);


const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);

const [productDialog, setProductDialog] = useState(false);
const [submitted, setSubmitted] = useState(false);



const fetchCharacter = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/productos"
      );
      const withMaterials = response.data.productos.filter(item => item.materiales.length > 0);
      const withoutMaterials = response.data.productos.filter(item => item.materiales.length === 0);
      setMaterial(withMaterials);
      setMateriaPrima(withoutMaterials);
    } catch (error) {
      console.error("Error fetching character:", error);
    }
  };
    useEffect(() => {
        fetchCharacter();
    }, []);
    const onSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const filterData = (data) => {
        if (!searchText) return data;
        return data.filter(item => 
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(searchText.toLowerCase())
            )
        );
    };

    
    const actionBodyTemplate = (rowData) => {
        console.log(rowData);
        return(
            <>  {rowData.cantidad<=rowData.cant_stock_bajo?(
                <div>
                    <Tag severity="danger" value="Bajo" />
                </div>
                ):(
                    <div>
                    <Tag severity="success" value="Normal" />
                </div>
                )}
                
            </>
        );
        // return (
        //     <React.Fragment>
        //         <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
        //         <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
        //     
        // );
    };
    const compra = (data) =>{
        return(
            <>
                <Button icon="pi pi-truck" label="Comprar" rounded  className="mr-2" />
            </>
        );
    }
    const produccion = (data) =>{
        return(
            <>
                <Button icon="pi pi-eject" label="Fabricar" rounded  className="mr-2" />
            </>
        );
    }
    
   
return (<>
        <Layout/>
        
        {permiso(29)?(
            <>
            <div style={{ width: '100%', height: '20px', visibility: 'hidden' }}></div>
            <div className="p-inputgroup">
                    <span className="p-inputgroup-addon"><i className="pi pi-search" /></span>
                    <InputText placeholder="Buscar..." value={searchText} onChange={onSearchChange} />
                </div>
            <div className="card">
                <TabView>
                    <TabPanel header="Articulos">
                        <div className="card">
                            <DataTable value={filterData(material)} showGridlines tableStyle={{ minWidth: '50rem' }}>
                                <Column field="serie" sortable  header="Serial"></Column>
                                <Column field="nombre" sortable  header="Nombre"></Column>
                                <Column field="precio_compra" sortable  header="Precio compra"></Column>
                                <Column field="precio_venta" sortable  header="Precio venta"></Column>
                                <Column field="fecha_vencimiento" sortable  header="Vencimiento"></Column>
                                <Column field="cantidad" sortable  header="Stock"></Column>
                                <Column body={actionBodyTemplate} header="Estado" exportable={false} style={{ minWidth: '12rem' }}></Column>
                                <Column body={produccion} header="Estado" exportable={false} style={{ minWidth: '12rem' }}></Column>
                            </DataTable>
                        </div>
                        </TabPanel>
                        <TabPanel header="Materia prima">
                        <div className="card">
                            <DataTable value={filterData(materiaPrima)} showGridlines tableStyle={{ minWidth: '50rem' }}>
                                <Column field="serie" sortable  header="Serial"></Column>
                                <Column field="nombre" sortable header="Nombre"></Column>
                                <Column field="precio_compra" sortable  header="Precio compra"></Column>
                                <Column field="precio_venta" sortable  header="Precio venta"></Column>
                                <Column field="fecha_vencimiento" sortable  header="Vencimiento"></Column>
                                {/* <Column field="nro_almacen" header="Category"></Column> */}
                                <Column field="cantidad" sortable header="Stock"></Column>
                                <Column body={actionBodyTemplate} header="Estado" exportable={false} style={{ minWidth: '12rem' }}></Column>
                                <Column body={compra} header="Estado" exportable={false} style={{ minWidth: '12rem' }}></Column>
                            
                            </DataTable>
                        </div>
                    </TabPanel>
                    
                </TabView>
            </div>
            </>
        ):(<>No tiene permisos para ver esta pagina</>)}

</>);
    
   
};
  
export default Inventario;