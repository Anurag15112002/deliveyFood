import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Order.css';
import { assets } from '../../assets/assets';

const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.post(url + "/api/order/admlist");
    if (response.data.success) {
      setOrders(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  // Status update handler
  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;

    // Optimistic UI update: Update the status in the local state immediately
    setOrders(prevOrders => 
      prevOrders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );

    // Make the backend update request
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: newStatus,
      });

      if (response.data.success) {
        // Optionally refetch orders from the backend to ensure consistency
        // await fetchAllOrders();
      } else {
        toast.error("Failed to update the status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div className="order-item-left">
              <p className='order-item-food'>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + "  x  " + item.quantity;
                  } else {
                    return item.name + "  x  " + item.quantity + ",";
                  }
                })}
              </p>
              <p className='order-item-name'>
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className='order-item-address'>
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + "," + order.address.state + "," + order.address.country + "," + order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>

            <div className="order-item-right">
              <p><b>Items:</b> {order.items.length}</p>
              <p><b>Amount:</b> ${order.amount}</p>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out For Delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
