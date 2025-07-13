import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useLiveOrders(ownerId: string) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: any;
    async function fetchAndSubscribe() {
      setLoading(true);
      setError(null);
      // Get seller's restaurants
      const { data: restaurants, error: restError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', ownerId);
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
      // Initial fetch
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .in('restaurant_id', restaurantIds)
        .neq('status', 'delivered')
        .order('created_at', { ascending: false });
      if (ordersError) setError(ordersError.message);
      setOrders(ordersData || []);
      setLoading(false);
      // Subscribe to changes
      subscription = supabase
        .channel('orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
          // Refetch on any change
          fetchAndSubscribe();
        })
        .subscribe();
    }
    fetchAndSubscribe();
    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [ownerId]);

  return { orders, loading, error };
}
