import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('restaurants').select('*');
      if (error) setError(error.message);
      setRestaurants(data || []);
      setLoading(false);
    };
    fetchRestaurants();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
      <h1>Restaurants</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {restaurants.map(r => (
          <li key={r.id} style={{ marginBottom: 16 }}>
            <strong>{r.name}</strong><br />
            <span>{r.location}</span>
          </li>
        ))}
      </ul>
      {!loading && restaurants.length === 0 && <p>No restaurants found.</p>}
    </div>
  );
}
