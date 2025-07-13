import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, activeUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      // Fetch all orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, total, customer_id');
      if (ordersError) {
        setError(ordersError.message);
        setLoading(false);
        return;
      }
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const activeUserIds = Array.from(new Set(orders.map(o => o.customer_id)));
      setStats({ orders: totalOrders, revenue: totalRevenue, activeUsers: activeUserIds.length });
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
      <h1>Platform Overview</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <ul>
          <li><strong>Total Orders:</strong> {stats.orders}</li>
          <li><strong>Total Revenue:</strong> ${stats.revenue}</li>
          <li><strong>Active Users:</strong> {stats.activeUsers}</li>
        </ul>
      )}
    </div>
  );
}
