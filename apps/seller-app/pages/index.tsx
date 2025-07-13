import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Orders from '../components/Orders';

const SellerDashboard = () => {
  return (
    <div>
      <h1>Seller Dashboard</h1>
      <Orders />
    </div>
  );
};

export default SellerDashboard;