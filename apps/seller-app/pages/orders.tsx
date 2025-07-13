import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('Not logged in');
        setLoading(false);
        return;
      }
      // Get seller's restaurants
      const { data: restaurants, error: restError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id);
      if (restError) {
        setError(restError.message);
        setLoading(false);
        return;
      }
      const restaurantIds = (restaurants || []).map(r => r.id);
      if (!restaurantIds.length) {
        setOrders([]);
        setLoading(false);
        return;
      }
      // Get open orders for these restaurants
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .in('restaurant_id', restaurantIds)
        .neq('status', 'delivered')
        .order('created_at', { ascending: false });
      if (ordersError) setError(ordersError.message);
      setOrders(ordersData || []);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
      <h1>Incoming Orders</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {orders.map(order => (
          <li key={order.id} style={{ marginBottom: 16 }}>
            <strong>Status:</strong>
            <StatusDropdown order={order} onStatusChange={async (newStatus) => {
              // PATCH order status in Supabase
              const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', order.id);
              if (!error) {
                setOrders(orders => orders.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
              }
            }} />
            <br />
            <strong>Total:</strong> ${order.total}<br />
            <span>{new Date(order.created_at).toLocaleString()}</span>
          </li>
        ))}
      </ul>
      {!loading && orders.length === 0 && <p>No open orders found.</p>}
    </div>
  );
}

function StatusDropdown({ order, onStatusChange }: { order: any, onStatusChange: (status: string) => void }) {
  const [status, setStatus] = useState(order.status);
  const [updating, setUpdating] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setUpdating(true);
    await onStatusChange(newStatus);
    setStatus(newStatus);
    setUpdating(false);
  };

  return (
    <select value={status} onChange={handleChange} disabled={updating} style={{ marginLeft: 8 }}>
      <option value="pending">Pending</option>
      <option value="preparing">Preparing</option>
      <option value="delivered">Delivered</option>
    </select>
  );
}
