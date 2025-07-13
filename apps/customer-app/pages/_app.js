import { useState, useEffect } from 'react';
import { useAuth } from '../lib/hooks/useAuth';

function MyApp({ Component, pageProps }) {
  const { user } = useAuth();

  return <Component {...pageProps} />;
}

export default MyApp;