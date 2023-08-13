import React, {useEffect, useState} from 'react';
import './TableStyles.css';

const API_HOST = "http://host:3000";
const INVENTORY_API_URL = `${API_HOST}/inventory`;

function App() {
    const [data, setData] = useState([]);

    const fetchInventory = () => {
        fetch(`${INVENTORY_API_URL}`)
            .then(res => res.json())
            .then(json => setData(json));
    }

    useEffect(() => {
        fetchInventory();
    }, []);


    const [inEditMode, setInEditMode] = useState({
        status: false,
        rowKey: null
    });

    const [unitPrice, setUnitPrice] = useState(null);
    const [product_name, setproduct_name] = useState(null);
    

    /**
     *
     * @param id - The id of the product
     * @param currentUnitPrice - The current unit price of the product
     * @param currentProductname
     */
    const onEdit = ({id, currentUnitPrice,currentProductname}) => {
        setInEditMode({
            status: true,
            rowKey: id
        })
        setUnitPrice(currentUnitPrice);
        setproduct_name(currentProductname);
    }

    /**
     *
     * @param id
     * @param newUnitPrice
     * @param newproductname
     */
    const updateInventory = ({id, newUnitPrice,newproductname}) => {
        fetch(`${INVENTORY_API_URL}/${id}`, {
            method: "PATCH",
            body: JSON.stringify({
                unit_price: newUnitPrice,
                product_name: newproductname
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                // reset inEditMode and unit price state values
                onCancel();

                // fetch the updated data
                fetchInventory();
            })
    }

    /**
     *
     * @param id -The id of the product
     * @param newUnitPrice - The new unit price of the product
     * @param newproductname
     */
    const onSave = ({id, newUnitPrice,newproductname}) => {
        updateInventory({id, newUnitPrice,newproductname});
    }

    const onCancel = () => {
        // reset the inEditMode state value
        setInEditMode({
            status: false,
            rowKey: null
        })
        // reset the unit price state value
        setUnitPrice(null);
    }

    return (
        <div className="container">
            <h1>DAQ OPC CONFIG PAGE:</h1>
            <table className="custom-table">
                <thead>
                <tr>
                    <th className="simple-header">Product Name</th>
                    <th className="simple-header">Product Category</th>
                    <th className="simple-header">Unit Price</th>
                    <th className="simple-header">Action</th>
                </tr>
                </thead>
                <tbody>
                {
                    data.map((item) => (
                        <tr key={item.id}>
                            <td>{inEditMode.status && inEditMode.rowKey === item.id ? (
                                        <input value={product_name} className="editing-input"
                                               onChange={(event) => setproduct_name(event.target.value)}
                                        />
                                        
                                    ):(item.product_name)
                                    }
                            </td>
                            <td>{item.product_category}</td>
                            <td>
                                {
                                    inEditMode.status && inEditMode.rowKey === item.id ? (
                                        <input value={unitPrice} className="editing-input"
                                               onChange={(event) => setUnitPrice(event.target.value)}
                                        />
                                        
                                    ) : (
                                        item.unit_price
                                    )
                                }
                            </td>
                            <td>
                                {
                                    inEditMode.status && inEditMode.rowKey === item.id ? (
                                        <React.Fragment>
                                            <button
                                                className={"btn-success"}
                                                onClick={() => onSave({id: item.id, newUnitPrice: unitPrice,newproductname: product_name})}
                                            >
                                                Save
                                            </button>

                                            <button
                                                className={"btn-secondary"}
                                                style={{marginLeft: 8}}
                                                onClick={() => onCancel()}
                                            >
                                                Cancel
                                            </button>
                                        </React.Fragment>
                                    ) : (
                                        <button
                                            className={"btn-primary"}
                                            onClick={() => onEdit({id: item.id, currentUnitPrice: item.unit_price,currentProductname: item.product_name})}
                                        >
                                            Edit
                                        </button>
                                    )
                                }
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
}

export default App;