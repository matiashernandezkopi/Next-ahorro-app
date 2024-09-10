// pages/_app.tsx

import '../app/globals.css'; // Asegúrate de que la ruta sea correcta

import type { AppProps } from 'next/app';
import { AuthProvider } from './context/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
