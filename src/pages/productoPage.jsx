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
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from 'primereact/calendar';
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from 'primereact/multiselect';
import { Timeline } from 'primereact/timeline';

import { AuthContext } from '../context/authContext';

import { OrganizationChart } from 'primereact/organizationchart';
import { set } from "react-hook-form";

const datos = {
    "productos": [
        {
            "id": 1,
            "nombre": "madera",
            "serie":"10008802",
            "fecha_creacion": "2024-05-01",
            "fecha_vencimiento":"2024-05-5",
            "cantidad":5,
            "precio_compra":15.45,
            "precio_venta": 1520.00,
            "cant_stock_bajo": 10
        },
        {
            "id": 2,
            "nombre": "clavos",
            "serie":"1000502",
            "fecha_creacion": "2024-05-01",
            "fecha_vencimiento":"2024-05-5",
            "cantidad":10,
            "precio_compra":15.45,
            "precio_venta": 1520.00,
            "cant_stock_bajo": 100
        },
        {
            "id": 3,
            "nombre": "patas",
            "serie":"10008802",
            "fecha_creacion": "2024-05-01",
            "fecha_vencimiento":"2024-05-5",
            "cantidad":5,
            "precio_compra":15.45,
            "precio_venta": 1520.00,
            "cant_stock_bajo": 10
        },
    ]
}





const Producto = () => {
    
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

    const direccion = 'productos';
    let emptyProducto = {
        'id': null,
        'serie':0,
        // 'precio_compra':0,
        'nombre': "",
        // 'precio_venta': 0,
        'modelo_id': null,
        'cant_stock_bajo':0,
        'fecha_vencimiento':'',
        'cantidad':0,
        'ubicaciones':null
    };
    let emptyRuta = {
        'id':null,
        'almacen_id':null,
        'estante_id':null,
        'fila_id':null
    };


const [productos, setProductos] = useState(null);
const [productosPrim, setProductosPrim] = useState(null);

const [producto, setProducto] = useState(emptyProducto);
const [showCod, setShowCod] = useState(false);


const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);

const [productDialog, setProductDialog] = useState(false);
const [viewDialog, setViewDialog] = useState(false);
const [rutaDialog, setRutaDialog] = useState(false);


const [submitted, setSubmitted] = useState(false);

const [selectedCity, setSelectedCity] = useState(null);

const [dateCreacion, setDateCreacion] = useState(null);
const [dateVencimiento, setDateVencimiento] = useState(null);
const [dateReal, setDateReal] = useState(null);
const [cities, setCities] = useState(null);
// dropdown
const [sucursal, setSucursal] = useState(null);
const [estante, setEstante] = useState(null);
const [fila, setFila] = useState(null);

const [selectSucursal, setSelectSucursal] = useState(null);
const [selectEstante, setSelectEstante] = useState(null);
const [selectFila, setSelectFila] = useState(null);

const [ruta, setRuta] = useState(emptyRuta);
const [events, setEvents] = useState(null);



const [selectProd, setSelectPro] = useState(null);

const [tipo, setTipo] = useState(null);

const [arbol, setArbol] = useState(null);



const toast = useRef(null);




const fetchCharacter = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/${direccion}`
      );
      const datos = response.data.productos.map(modulo => ({
        code: modulo.id,
        name: modulo.nombre,
                    // slag: modulo.slag
    }));
      setProductos(response.data.productos);
      setProductosPrim(datos);
    //   console.log(response.data.productos);
    } catch (error) {
      console.error("Error fetching character:", error);
    }
};

const fetchTipo = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/modelos`
      );
      const modeloParse = response.data.modelos.map(modulo => ({
        code: modulo.id,
        name: modulo.descripcion,
        // slag: modulo.slag
    }));
      setCities(modeloParse);
    
    //   console.log(modeloParse);
    } catch (error) {
      console.error("Error fetching character:", error);
    }
};

const fetchTipoId = async (x) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/modelos/${x}`
      );

      setSelectedCity({
        code: response.data.modelo['id'],
        name: response.data.modelo['descripcion']
      });    
      response.data.modelo['id']==2?(setShowCod(true)):(setShowCod(false))
      
      
    } catch (error) {
      console.error("Error fetching character:", error);
    }
};


const fetchMateriasPrima = async (x) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/productos/${x}`
      );
      const datos = response.data.producto.materiales.map(modulo => ({
        code: modulo.id,
        name: modulo.nombre,
    }));

        const nombreMateria = response.data.producto.nombre;

        const materiales = response.data.producto.materiales.map(modulo => ({
            label: modulo.nombre,
        }));

        setArbol([{
            label:nombreMateria,
            expanded:true,
            children:materiales
        }]);
        setSelectPro(datos);
        // console.log(datos);    
    } catch (error) {
      console.error("Error fetching character:", error);
    }
};

const fetchRutasEdit = async (x) => {
    // console.log(x.ubicaciones[0].id);
    const idRuta = x.ubicaciones[0].id;

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/ubicaciones/${idRuta}`
      );

    //   console.log(`http://127.0.0.1:8000/api/ubicaciones/${idRuta}`);
        // console.log(response.data.ubicacion);
        const { id, almacen, estante, fila } = response.data.ubicacion;
        ruta['id'] = id;
        console.log(response.data.ubicacion);
        
        setSelectSucursal({
          name: almacen.descripcion,
          code: almacen.id
        });
        
        setSelectEstante({
          name: estante.descripcion,
          code: estante.id
        });
        setSelectFila({
          name: fila.codigo,
          code: fila.id
        });

        // const events = [
        //     { status: '--', icon: 'pi pi-warehouse', color: '#673AB7' },
        //     { status: '--', icon: 'pi pi-box', color: '#FF9800' },
        //     { status: '--', icon: 'pi pi-table', color: '#607D8B' }
        // ];
        setEvents([
            { status: almacen.descripcion, icon: 'pi pi-warehouse', color: '#673AB7' },
            { status: estante.descripcion, icon: 'pi pi-box', color: '#FF9800' },
            { status: fila.codigo, icon: 'pi pi-table', color: '#607D8B' }
        ])
        // events[0].status = almacen.descripcion;
        // events[1].status = estante.descripcion;
        // events[2].status = fila.codigo;
        
        ruta['almacen_id'] = almacen.id;
        ruta['estante_id'] = estante.id;
        ruta['fila_id'] = fila.id;

        console.log(events);
      
    } catch (error) {
      console.error("Error fetching character:", error);
    }
};

const fetchRutas = async () => {
    try {
      const sucursal = await axios.get(
        `http://127.0.0.1:8000/api/almacenes`
      );
      const estante = await axios.get(
        `http://127.0.0.1:8000/api/estantes`
      );
      const fila = await axios.get(
        `http://127.0.0.1:8000/api/filas`
      );
      const almacenDato = sucursal.data.almacenes.map(modulo => ({
        code: modulo.id,
        name: modulo.descripcion,
      }));
      setSucursal(almacenDato);
      const estanteDato = estante.data.estantes.map(modulo => ({
        code: modulo.id,
        name: modulo.descripcion,
      }));
      setEstante(estanteDato);
      const filaDato = fila.data.map(modulo => ({
        code: modulo.id,
        name: modulo.codigo,
      }));
      setFila(filaDato);
  
    } catch (error) {
      console.error("Error fetching character:", error);
    }
};
    useEffect(() => {
        fetchCharacter();
    }, []);

useEffect(() => {
    // datos.then(data => setProductos(data));
    // console.log(datos.productos);
    // setProductos(datos.productos);
    fetchRutas();
    fetchCharacter();
    fetchTipo();
}, []);


    const onInputChange = (e, name) => {
        const val = ((e.target && e.target.value) || '').toUpperCase();;
        let _product = { ...producto };

        _product[`${name}`] = val;
        // console.log(_product);
        setProducto(_product);
    };

    const onInputNumberChange = (e, name) => {
        
        const val = e.value || 0;
        let _product = { ...producto };
        _product[`${name}`] = val;
    
        setProducto(_product);
      };
 
    const openNew = () => {
        // setSelectSstante(null);
        // setSelectSucursal(null);
        // setSelectSila(null);
        setSelectedCity(null);
        setDateVencimiento(null);
        setDateReal(null);
        setProducto(emptyProducto);
        setProductDialog(true);
        setShowCod(false);
    };
    // -------------------------
    const hideDialog = () => {
        setSelectEstante(null);
        setSelectSucursal(null);
        setSelectFila(null);

        setArbol(null);
        setProductDialog(false);
        setRutaDialog(false);
        setViewDialog(false);
        setSelectPro(null);
        setSelectedCity(null);
        setProducto(emptyProducto);
    };
    const saveProduct =async () => {
        const codigos = selectProd?.map(item => item.code);
        setSubmitted(true);
        producto['materiales']=codigos;
        console.log(ruta);

        if (producto.nombre.trim()) {

            if(producto.id){
                try {
                    const res = await axios.put(`http://127.0.0.1:8000/api/${direccion}/${producto.id}`,producto,cabeza);
                    // const id = res.data.producto.id;

                    ruta['producto_id'] = producto.id;
                    console.log(ruta);
                    // const idRuta = x.ubicaciones[0].id
                    try {
                        await axios.put(`http://127.0.0.1:8000/api/ubicaciones/${producto.ubicaciones[0].id}`,ruta,cabeza);
                    } catch (error) {
                        console.log(error);
                    }
                    setProductDialog(false);
                    showSuccess('Producto actualizado exitosamente');
                    setProducto(emptyProducto);
                    console.log(res);
                    // fetchCharacter();
                } catch (error) {
                    console.log(error);
                    showError();
                }
            }else{
                try {
                    const res = await axios.post(`http://127.0.0.1:8000/api/${direccion}`,producto,cabeza);
                    setProductDialog(false);
                    const id = res.data.producto.id;
                    try{
                        await axios.post(`http://127.0.0.1:8000/api/productos/${id}/ubicaciones`,ruta,cabeza);
                    }catch(error){
                        console.log(error);
                    }

                    showSuccess('Producto creado exitosamente');
                    console.log(res);
                    setProducto(emptyProducto);
                    
                } catch (error) {
                    console.log(error);
                    showError();
                }
            }
            fetchCharacter();
            // fetchMateriasPrima();
            setSubmitted(false);

        }
    };

    const saveRutaProduct =async () => {
        
        console.log(producto);
        setSubmitted(true);


        // if (producto.nombre.trim()) {

        //     if(producto.id){
        //         try {
        //             const res = await axios.put(`http://127.0.0.1:8000/api/${direccion}/${producto.id}`,producto);
        //             setProductDialog(false);
        //             showSuccess('Producto actualizado exitosamente');
        //             setProducto(emptyProducto);
        //             console.log(res);
        //             // fetchCharacter();
        //         } catch (error) {
        //             console.log(error);
        //             showError();
        //         }
        //     }else{
        //         try {
        //             const res = await axios.post(`http://127.0.0.1:8000/api/${direccion}`,producto);
        //             setProductDialog(false);
        //             showSuccess('Producto creado exitosamente');
        //             console.log(res);
        //             setProducto(emptyProducto);
                    
        //         } catch (error) {
        //             console.log(error);
        //             showError();
        //         }
        //     }
        //     fetchCharacter();
        //     fetchMateriasPrima();
        //     setSubmitted(false);

        //   }
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
    const viewDialogFooter = (
        <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
        {/* <Button label="Editar" icon="pi pi-check" onClick={editProduct(producto)} /> */}
        {/* <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} /> */}

        </React.Fragment>
    );
    const rutaDialogFooter = (
        <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
        <Button label="Guardar ruta" icon="pi pi-check" onClick={saveProduct} />
        {/* <Button label="Editar" icon="pi pi-check" onClick={editProduct(producto)} /> */}
        {/* <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} /> */}

        </React.Fragment>
    );


    // --------------------------------------------
    const parseDate = (dateString) => {
        // Dividir la cadena de fecha en año, mes y día
        const [year, month, day] = dateString.split('-');
        // Crear un objeto Date con los componentes de la fecha
        return new Date(year, month - 1, day); // El mes en Date es 0-indexado, por lo que restamos 1
    };

    const editProduct = (obj) => {
        setSelectedCity(null);

        fetchMateriasPrima(obj.id);
        fetchRutasEdit(obj);

        setProducto(obj);
        fetchTipoId(obj.modelo_id);
        setDateCreacion(parseDate(obj.fecha_creacion));
        setDateVencimiento(parseDate(obj.fecha_vencimiento));
        setProductDialog(true);
    };

    const viewProduct = (obj) => {
        setSelectedCity(null);

        fetchMateriasPrima(obj.id);
        fetchRutasEdit(obj);

        setProducto(obj);
        fetchTipoId(obj.modelo_id);
        setDateCreacion(parseDate(obj.fecha_creacion));
        setDateVencimiento(parseDate(obj.fecha_vencimiento));
        setViewDialog(true);
    };

    const rutaProduct = (obj) => {
        setProducto(obj);
        console.log(obj);
        // fetchRutas();
        setRutaDialog(true);
    };

    // --------------------------------------------------
    const confirmDeleteProduct = (obj) => {
        console.log(obj);
        setProducto(obj);
        setDeleteProductsDialog(true);
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                
                <Button icon="pi pi-eye" rounded outlined className="mr-2" onClick={() => viewProduct(rowData)} />
                {permiso(27)?(
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />

                ):(<></>)}
                {permiso(28)?(
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
            await axios.delete(`http://127.0.0.1:8000/api/${direccion}/${producto.id}`,cabeza);
            // fetchCharacter();
            showSuccess('Producto eliminado exitosamente');
            setDeleteProductsDialog(false);
            setProducto(emptyProducto);
            fetchCharacter();
            fetchTipo();
        } catch (error) {
            console.log(error);
            showError();

        }

      };

    const deleteProductsDialogFooter = (
        <React.Fragment>
          <Button label="No" icon="pi pi-times"outlined onClick={hideDeleteProductsDialog}  />
          <Button label="Si"  icon="pi pi-check"  severity="danger"  onClick={deleteProduct}/>
        </React.Fragment>
      );
     
    const selecionarFecha=(value,tipo)=>{
        const isoString = value.toISOString();
        const fecha = isoString.substring(0, 10);
        // console.log(fecha);
        let _product = { ...producto };
        
        if(tipo==='creacion'){
            _product[`fecha_creacion`] = fecha;
        }else{
            _product[`fecha_vencimiento`] = fecha;
        }
        setProducto(_product);
        
        // setDate(value);
        // setDateReal(fecha);
    }

    const selectCity = (x)=>{
        // console.log(x['name']);
        setSelectedCity(x);
        let _product = { ...producto };
        _product[`modelo_id`] = x['code'];
    
        setProducto(_product);
        
        if(x['code'] === 2){
            setShowCod(true)
        }else{
            setShowCod(false)
            setSelectPro(null);
        }
    }

    const selectRuta = (x,a)=>{
        if(a==='almacen_id'){
            setSelectSucursal(x);
        }else if(a==='estante_id'){
            setSelectEstante(x);
        }else{
            setSelectFila(x);
        }
        let _ruta = { ...ruta };
        _ruta[`${a}`] = x['code'];
        setRuta(_ruta);
        console.log(ruta);
    }

    const onChangeSave = (event) => {
        setSelectPro(event);
    };
   

return (<>
        <Layout/>
        <Toast ref={toast} />

        {permiso(25)?(
        <>
        <div style={{ width: '100%', height: '20px', visibility: 'hidden' }}></div>
        <div className="card">
        {permiso(26)?(
        <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />

        ):(<></>)}
            <DataTable value={productos} tableStyle={{ minWidth: '50rem' }}>
                <Column field="serie" header="Serie"></Column>
                <Column field="nombre" header="Nombre"></Column>                
                <Column field="fecha_creacion" header="Fecha de creacion"></Column>
                <Column field="fecha_vencimiento" header="Fecha de vencimiento"></Column>
                <Column field="cantidad" header="Cantidad"></Column>
                <Column field="precio_compra" header="Precio de compra"></Column>
                <Column field="precio_venta" header="Precio de venta"></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>
        </div>


            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="field">
                <label htmlFor="compra" className="font-bold">
                    Serie
                </label>  
                    <InputNumber value={producto.serie} onChange={(e) => onInputNumberChange(e,"serie")} useGrouping={false}  />
                    {submitted && !producto.serie && ( <small className="p-error">es requerido.</small>)}
                </div>


                <div className="field">
                    <label htmlFor="name" className="font-bold">
                    Nombre
                    </label>
                    <InputText id="descripcion" value={producto.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !producto.nombre })} />
                    {submitted && !producto.nombre && <small className="p-error">Name is required.</small>}
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Fecha de vencimiento
                    </label>
                    <div className="card flex justify-content-center">
                        <Calendar value={dateVencimiento} onChange={(e) => selecionarFecha(e.value,'vencimiento')} />
                    </div>
                </div>

                <div className="field">
                <label htmlFor="compra" className="font-bold">
                    Cantidad
                </label>  
                    <InputNumber value={producto.cantidad} onChange={(e) => onInputNumberChange(e,"cantidad")} useGrouping={false} className={classNames({ 'p-invalid': submitted && !producto.cantidad })}  />
                    {submitted && !producto.cantidad && ( <small className="p-error">es requerido.</small>)}
                </div>

                <div className="field">
                <label htmlFor="compra" className="font-bold">
                    Umbral de compra
                </label>  
                    <InputNumber value={producto.cant_stock_bajo} onChange={(e) => onInputNumberChange(e,"cant_stock_bajo")} useGrouping={false} className={classNames({ 'p-invalid': submitted && !producto.cant_stock_bajo })}  />
                    {submitted && !producto.cant_stock_bajo && ( <small className="p-error">es requerido.</small>)}
                </div>

                <div className="field">
                <label htmlFor="compra" className="font-bold">
                    Precio compra
                </label>  
                    <InputNumber inputId="currency-us" value={producto.precio_compra} onChange={(e) => onInputNumberChange(e,"precio_compra")} mode="currency" currency="USD" locale="en-US" />
                    {submitted && !producto.precio_compra && ( <small className="p-error">es requerido.</small>)}
                </div>

                <div className="field">
                <label htmlFor="compra" className="font-bold">
                    Preccio venta
                </label>  
                    <InputNumber inputId="currency-us" value={producto.precio_venta} onChange={(e) => onInputNumberChange(e,"precio_venta")} mode="currency" currency="USD" locale="en-US" />
                    {submitted && !producto.precio_venta && ( <small className="p-error">es requerido.</small>)}
                </div>

                <div className="field">
                <label htmlFor="compra" className="font-bold">
                    Ubicacion del articulo
                </label>  
                {sucursal&&estante&&fila?(
                    <div>
                    <div className="field">
                    <Dropdown value={selectSucursal} onChange={(e) => {selectRuta(e.value,'almacen_id')}} options={sucursal} optionLabel="name" placeholder="Almacen" className="w-full md:w-14rem" />
                    <Dropdown value={selectEstante} onChange={(e) => {selectRuta(e.value,'estante_id')}} options={estante} optionLabel="name" placeholder="Estante" className="w-full md:w-14rem" />
                    <Dropdown value={selectFila} onChange={(e) => {selectRuta(e.value,'fila_id')}} options={fila} optionLabel="name" placeholder="Fila" className="w-full md:w-14rem" />
                    
                  </div>
                    </div>
                ):(
                    <h3>Cargando</h3>
                )}
                </div>


                <div className="field">
                <label htmlFor="compra" className="font-bold">
                    Tipo de articulo
                </label>  
                <Dropdown value={selectedCity} onChange={(e) => {selectCity(e.value)}} options={cities} optionLabel="name" placeholder="Seleccione un tipo" className="w-full md:w-14rem" />
                    {submitted && !producto.modelo_id && ( <small className="p-error">es requerido.</small>)}
                </div>

               

                

                
                {showCod&&(
                    <div className="field">
                    <label htmlFor="compra" className="font-bold">
                        Materiales
                    </label>  
                    <MultiSelect value={selectProd} onChange={(e) => onChangeSave(e.value)} options={productosPrim} optionLabel="name" 
                                placeholder="Seleccionar articulos" maxSelectedLabels={5} className="w-full md:w-20rem" />
                    </div>
                )}
               
               
            </Dialog>


            <Dialog visible={viewDialog} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={viewDialogFooter} onHide={hideDialog}>
            <div className="field">
                <label htmlFor="compra" className="font-bold">
                    Serie
                </label>   
                    <InputNumber disabled value={producto.serie} onChange={(e) => onInputNumberChange(e,"serie")} useGrouping={false}  />
                    {submitted && !producto.serie && ( <small className="p-error">es requerido.</small>)}
                </div>


                <div className="field">
                    <label htmlFor="name" className="font-bold">
                    Nombre
                    </label>
                    <InputText disabled id="descripcion" value={producto.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !producto.nombre })} />
                    {submitted && !producto.nombre && <small className="p-error">Name is required.</small>}
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Fecha de vencimiento
                    </label>
                    <div className="card flex justify-content-center">
                        <Calendar disabled value={dateVencimiento} onChange={(e) => selecionarFecha(e.value,'vencimiento')} />
                    </div>
                </div>

                <div className="field">
                <label htmlFor="compra" className="font-bold">
                    Cantidad
                </label>  
                    <InputNumber disabled value={producto.cantidad} onChange={(e) => onInputNumberChange(e,"cantidad")} useGrouping={false} className={classNames({ 'p-invalid': submitted && !producto.cantidad })}  />
                    {submitted && !producto.cantidad && ( <small className="p-error">es requerido.</small>)}
                </div>

                <div className="field">
                <label htmlFor="compra" className="font-bold">
                    Umbral de compra
                </label>  
                    <InputNumber disabled value={producto.cant_stock_bajo} onChange={(e) => onInputNumberChange(e,"cant_stock_bajo")} useGrouping={false} className={classNames({ 'p-invalid': submitted && !producto.cant_stock_bajo })}  />
                    {submitted && !producto.cant_stock_bajo && ( <small className="p-error">es requerido.</small>)}
                </div>

                <div className="field">
                <label htmlFor="compra" className="font-bold">
                    Precio compra
                </label>  
                    <InputNumber disabled inputId="currency-us" value={producto.precio_compra} onChange={(e) => onInputNumberChange(e,"precio_compra")} mode="currency" currency="USD" locale="en-US" />
                    {submitted && !producto.precio_compra && ( <small className="p-error">es requerido.</small>)}
                </div>

                <div className="field">
                <label htmlFor="compra" className="font-bold">
                    Preccio venta
                </label>  
                    <InputNumber disabled inputId="currency-us" value={producto.precio_venta} onChange={(e) => onInputNumberChange(e,"precio_venta")} mode="currency" currency="USD" locale="en-US" />
                    {submitted && !producto.precio_venta && ( <small className="p-error">es requerido.</small>)}
                </div>

                
                <div className="field">
                <label htmlFor="compra" className="font-bold">
                    Tipo de articulo
                </label>  
                <Dropdown disabled value={selectedCity} onChange={(e) => {selectCity(e.value)}} options={cities} optionLabel="name" placeholder="Seleccione un tipo" className="w-full md:w-14rem" />
                    {submitted && !producto.modelo_id && ( <small className="p-error">es requerido.</small>)}
                </div>
                <label htmlFor="compra" className="font-bold">
                    Arbol de materiales
                </label> 
                <div className="card overflow-x-auto">
                    {arbol&&(<OrganizationChart value={arbol} />)}
                </div>
                <label htmlFor="compra" className="font-bold">
                    Ubicacion
                </label>
                <div className="card">
                    <Timeline value={events} content={(item) => (
                        <div>
                            <i className={item.icon} style={{ color: item.color, marginRight: '0.5em' }}></i>
                            <span>{item.status}</span>
                        </div>
                    )} />
                    {/* <Timeline value={events} content={(item) => item.status} /> */}
                </div>

        
            </Dialog>


            <Dialog visible={deleteProductsDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Eliminar"  modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}
            >
                <div className="confirmation-content">
                <i
                    className="pi pi-exclamation-triangle mr-3"
                    style={{ fontSize: "2rem" }}
                />
                {producto && (
                    <span>
                    Seguro que quieres eliminar este articulo? <b>{producto.nombre}</b>?
                    </span>
                )}
                </div>
            </Dialog>
            </>):(<>No tiene permisos para ver la pagina</>)}
</>);
    
   
};
  
export default Producto;