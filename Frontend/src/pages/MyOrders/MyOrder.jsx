import React, { useContext, useEffect, useState } from 'react'
import './MyOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { assets } from '../../assets/assets'

const MyOrder = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        try {
            // Sending the request to fetch user orders
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
            
            // Logging the full response to check the data structure
            console.log(response.data);

            // Check if data contains orders and set it accordingly
            if (response.data && response.data.orders) {
                setData(response.data.orders); // Access the orders array
            } else {
                console.error("No orders found:", response.data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders();  // Fetch orders if token exists
        }
    }, [token]);

    return (
        <div className='my-orders'>
           <h2>My Orders</h2>
           <div className="container">
            {data.map((order,index)=>{
                return (
                    <div key={index} className="my-orders-order">
                       <img src={assets.parcel_icon} alt="" />
                       <p>{order.items.map((item,index)=>{
                        if(index=== order.items.length-1){
                            return item.name+"x"+item.quantity
                        }
                        else{
                            return item.name+"x"+item.quantity+","
                        }
                       })}</p>
                       <p>${order.amount}.00</p>
                       <p>Items:{order.items.length}</p>
                       <p><span>&#x25cf;</span><b>{order.status}</b></p>
                       <button>Track Order</button>
                    </div>
                )
            })}
           </div>
        </div>
    )
}

export default MyOrder;
