// pages/_app.tsx

import '../app/globals.css'; // Asegúrate de que la ruta sea correcta

import type { AppProps } from 'next/app';
import { AuthProvider } from './context/AuthContext';
import { DarkModeToggle } from './darkmode';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <DarkModeToggle />
    </AuthProvider>
  );
}

export default MyApp;
