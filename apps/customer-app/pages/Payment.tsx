import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Yoco } from 'yoco-js';

const Payment = () => {
  const [yoco, setYoco] = useState<Yoco | null>(null);

useEffect(() => {
  const fetchYoco = async () => {
    const { data, error } = await supabase
      .from('yoco')
      .select('*');
    if (error) {
      console.error(error);
    } else {
      setYoco(new Yoco(data.yocoApiKey));
    }
  };
  fetchYoco();
}, []);
  const handlePayment = async () => {
  if (!yoco) return;
  const paymentIntent = await yoco.createPaymentIntent({
    amount: 1000,
    currency: 'zar',
  });
  console.log(paymentIntent);
};

  return (
    <div>
      <h1>Payment</h1>
      <button onClick={handlePayment}>Make Payment</button>
    </div>
  );
};

export default Payment;