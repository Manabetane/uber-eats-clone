import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function RestaurantDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();
      if (restaurantError) setError(restaurantError.message);
      setRestaurant(restaurantData);
      const { data: menuData, error: menuError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', id);
      if (menuError) setError(menuError.message);
      setMenuItems(menuData || []);
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div style={{ padding: 32 }}>Loading...</div>;
  if (error) return <div style={{ padding: 32, color: 'red' }}>{error}</div>;
  if (!restaurant) return <div style={{ padding: 32 }}>Restaurant not found.</div>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.location}</p>
      <h2>Menu</h2>
      <ul>
        {menuItems.map(item => (
          <li key={item.id} style={{ marginBottom: 16 }}>
            <strong>{item.title}</strong> - ${item.price}<br />
            <span>{item.description}</span>
          </li>
        ))}
      </ul>
      {!menuItems.length && <p>No menu items found.</p>}
    </div>
  );
}
