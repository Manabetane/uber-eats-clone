import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*');
      if (error) {
        console.error(error);
      } else {
        setOrders(data);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>{order.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;