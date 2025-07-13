import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const CustomerDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*');
      if (error) {
        console.error(error);
      } else {
        setRestaurants(data);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div>
      <h1>Customer Dashboard</h1>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id}>{restaurant.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerDashboard;