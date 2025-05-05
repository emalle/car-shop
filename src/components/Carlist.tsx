import { useEffect, useState } from "react";

import { AgGridReact } from '@ag-grid-community/react';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-material.css';

import type { ColDef } from '@ag-grid-community/core';

import Button from "@mui/material/Button";

import AddCar from "./AddCar";
import EditCar from "./EditCar";
import { getCars } from "../carapi";
import { deleteCar } from "../carapi";
import type { Car } from "../types";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function Carlist() {
    const [cars, setCars] = useState<Car[]>([]);

    useEffect(() => {
        console.log("Cars in grid:", cars);
    }, [cars]);

    useEffect(() => {
        fetchCars();
    }, []);

    const [colDefs] = useState<ColDef<Car>[]>([
        { field: "brand", filter: true },
        { field: "model", filter: true, width: 200 },
        { field: "color", filter: true, width: 100 },
        { field: "fuel", filter: true, width: 100 },
        { field: "modelYear", filter: true, width: 150 },
        { field: "price", filter: true },
        {
            cellRenderer: (params: any) => (
                <EditCar data={params.data} fetchCars={fetchCars} updateCar={updateCar} />

            ),
            width: 150,
        },
        {
            cellRenderer: (params: any) => (
                <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(params.data._links.car.href)}
                >
                    Delete
                </Button>
            ),
            width: 150,
        },
    ]);
    const fetchCars = () => {
        getCars()
            .then((data) => setCars(data._embedded.cars))
            .catch((err) => console.error(err));
    };

    const handleDelete = (url: string) => {
        if (window.confirm("Are you sure to delete this car?")) {
            deleteCar(url)
                .then(() => fetchCars())
                .catch((err) => console.error(err));
        }
    };
    const addCar = (newCar: any) => {
        fetch(import.meta.env.VITE_API_URL, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(newCar),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Error when adding car");
                return response.json();
            })
            .then(() => fetchCars())
            .catch((err) => console.error(err));
    };

    const updateCar = (url: string | URL | Request, updatedCar: any) => {
        fetch(url, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(updatedCar),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Error when updating car");
                return response.json();
            })
            .then(() => fetchCars())
            .catch((err) => console.error(err));
    };
    return (
        <>
            <AddCar addCar={addCar} fetchCars={fetchCars} />

            <div style={{ overflowX: "auto" }}>
                <div
                    className="ag-theme-material"
                    style={{ width: "max-content", minWidth: "100%", height: 600 }}
                >
                    <AgGridReact
                        rowData={cars}
                        columnDefs={colDefs}
                        defaultColDef={{
                            flex: 1,
                            resizable: true,
                            sortable: true,
                        }}
                        pagination={true}
                        paginationAutoPageSize={true}
                    />
                </div>
            </div>
        </>
    );
}
export default Carlist;

