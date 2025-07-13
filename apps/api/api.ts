import { NextApiRequest, NextApiResponse } from 'next';
import supabase from '../lib/supabase';

const api = async (req: NextApiRequest, res: NextApiResponse) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const { data, error } = await supabase.auth.api.getUser(token);
  if (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*');
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch restaurants' });
    }
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { data, error } = await supabase
      .from('orders')
      .insert(req.body);
    if (error) {
      return res.status(500).json({ error: 'Failed to create order' });
    }
    return res.status(201).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

export default api;