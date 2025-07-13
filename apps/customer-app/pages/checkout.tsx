import { useCart } from '../store/cart';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      if (items.length === 0) throw new Error('Cart is empty');
      // Assume all items are from the same restaurant
      const restaurantId = items[0].restaurant_id;
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Not logged in');
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: user.id,
          restaurant_id: restaurantId,
          status: 'pending',
          total,
        })
        .select()
        .single();
      if (orderError) throw orderError;
      // Create order_items
      const orderItems = items.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
      }));
      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      if (orderItemsError) throw orderItemsError;
      clearCart();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Checkout failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
      <h1>Checkout</h1>
      <p><strong>Total:</strong> ${total}</p>
      <button onClick={handleCheckout} disabled={loading || items.length === 0}>
        {loading ? 'Processing...' : 'Submit Order'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Order placed successfully!</p>}
    </div>
  );
}
