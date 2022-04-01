import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Addcar from "./Addcar";
import Editcar from "./Editcar";


export default function Carlist(){
  
    const[cars, setCars] = useState([]);
    const fetchData = () => {
        fetch('https://carstockrest.herokuapp.com/cars')
        .then(response => response.json())
        .then(responseData => setCars(responseData._embedded.cars))
    }

    //Määritellään sarakkeet
    const columns = [
        {headerName: 'Brand', field: 'brand', sortable: true},
        {headerName: 'Model', field: 'model', sortable: true},
        {headerName: 'Color', field: 'color', sortable: true},
        {headerName: 'Fuel', field: 'fuel', sortable: true},
        {headerName: 'Year', field: 'year', sortable: true},
        {headerName: 'Price', field: 'price', sortable: true},
        {headerName: 'Edit row', 
          sortable: false, 
          filter: false,
          floatingFilter: false,
          width: 100,
          cellRenderer: row => <Editcar updateCar={updateCar} car={row.data}/>},
        {headerName: 'Delete row', 
          field: '_links.self.href', 
          sortable: false, 
          filter: false,
          floatingFilter: false,
          width: 100, 
          cellRenderer: row => <Button size="small" variant="outlined" startIcon={<DeleteIcon />}  onClick={() => deleteCar(row.value)}>Delete</Button> },
    ];

    const deleteCar = (link) => {
      if (window.confirm('Are you sure?')) {
      fetch(link, {method: 'DELETE'})
      .then (res => fetchData())
      .catch(err => console.error(err))
      }
    };

    const saveCar = (car) => {
      fetch('https://carstockrest.herokuapp.com/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(car)
      })
      .then(res => fetchData())
      .catch(err => console.error(err))
    }

    const updateCar = (car,link) => {
      fetch(link, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(car)
      })
      .then(res => fetchData())
      .catch(err => console.error(err))
    }

    const defaultColDef = useMemo(() => {
        return {
          editable: true,
          sortable: true,
          flex: 1,
          minWidth: 100,
          filter: true,
          floatingFilter: true,
          resizable: true,
        };
      }, []);
      
    const gridRef = useRef();

/*    const onSelectionChanged = useCallback(() => {
      const selectedRows = gridRef.current.api.getSelectedRows();
      document.querySelector('#selectedRows').innerHTML =
        selectedRows.length === 1 ? selectedRows[0].brand : '';
        console.log([selectedRows])
    }, []);*/

    useEffect(() => fetchData(), []);

    return (
        <div
        className="ag-theme-material"
        style={{
          height: '700px',
          width: '80%',
          margin: 'auto' }}
        >
            <Addcar saveCar={saveCar}/>
            <AgGridReact
              ref={gridRef}
              defaultColDef={defaultColDef}
              onGridReady= { params => gridRef.current = params.api }
              animateRows={true}
              rowSelection={'single'}
              columnDefs={columns}
              rowData={cars}
              //onSelectionChanged={onSelectionChanged}
              >
            </AgGridReact>

        </div>
    )
}